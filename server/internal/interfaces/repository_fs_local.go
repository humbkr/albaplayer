package interfaces

import (
	"bytes"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/spf13/viper"
	"go.senan.xyz/taglib"
)

var validCoverExtensions = []string{
	".png",
	".jpg",
	".jpeg",
	".gif",
}

var validCoverNames = []string{
	"cover",
	"artwork",
	"album",
	"front",
	"folder",
}

var validAudioExtensions = map[string]bool{
	".mp3":  true,
	".flac": true,
	".ogg":  true,
	".m4a":  true,
}

// Stores media metadata retrieved from different sources.
type mediaMetadata struct {
	Format      string
	Title       string
	Album       string
	Artist      string
	AlbumArtist string
	Genre       string
	Year        string
	Track       int
	Disc        string // Format: <number>/<total>
	Picture     *embeddedPicture
	Duration    int // Duration in seconds.
	Path        string
}

// embeddedPicture is a cover image stored in the tags of a media file.
type embeddedPicture struct {
	Ext  string // Without leading dot, e.g. "jpg".
	Data []byte
}

// scanCacheEntry stores the last-known modification time and size of a scanned file.
type scanCacheEntry struct {
	Mtime int64
	Size  int64
}

// scanContext holds shared state for the duration of a scan: caches, prepared
// statements, and the current transaction.  It is passed through every scan
// helper so that work is not repeated.
type scanContext struct {
	db               *sql.DB
	tx               *sql.Tx
	variousArtistsId int
	dirsProcessed    int
	forceRescan      bool

	// Prepared statements (created once, reused for every row).
	stmtInsertArtist *sql.Stmt
	stmtUpdateArtist *sql.Stmt
	stmtInsertAlbum  *sql.Stmt
	stmtUpdateAlbum  *sql.Stmt
	stmtInsertTrack  *sql.Stmt
	stmtUpdateTrack  *sql.Stmt
	stmtInsertCover  *sql.Stmt
	stmtUpdateCover  *sql.Stmt

	// In-memory caches (populated during the scan to avoid redundant DB lookups).
	artistCache map[string]int // artist name  -> id
	albumCache  map[string]int // "title\x00artistId" -> id
	coverCache  map[string]int // cover hash   -> id

	// File scan cache: tracks which files have already been scanned and with
	// what mtime/size, so unchanged files can be skipped on re-scan.
	fileCache      map[string]scanCacheEntry // loaded from DB at start
	fileCacheDirty map[string]scanCacheEntry // entries to upsert at end

	// Progress counter (atomic, shared with LibraryInteractor for polling).
	progress *int64
}

const checkpointInterval = 500 // commit and re-open transaction every N directories

func newScanContext(db *sql.DB, force bool) (*scanContext, error) {
	sc := &scanContext{
		db:             db,
		forceRescan:    force,
		artistCache:    make(map[string]int),
		albumCache:     make(map[string]int),
		coverCache:     make(map[string]int),
		fileCache:      make(map[string]scanCacheEntry),
		fileCacheDirty: make(map[string]scanCacheEntry),
	}

	// Load the scan cache from DB (unless forcing a full rescan).
	if !force {
		if err := sc.loadFileCache(); err != nil {
			log.Println("WARNING - Could not load scan cache, performing full scan:", err)
		}
	}

	if err := sc.beginTransaction(); err != nil {
		return nil, err
	}

	return sc, nil
}

// loadFileCache reads all entries from the scan_cache table into memory.
func (sc *scanContext) loadFileCache() error {
	rows, err := sc.db.Query("SELECT path, mtime, size FROM scan_cache")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var p string
		var entry scanCacheEntry
		if err := rows.Scan(&p, &entry.Mtime, &entry.Size); err != nil {
			return err
		}
		sc.fileCache[p] = entry
	}

	return rows.Err()
}

// isFileUnchanged checks if a file's mtime and size match the scan cache.
func (sc *scanContext) isFileUnchanged(filePath string, mtime int64, size int64) bool {
	if sc.forceRescan {
		return false
	}
	if cached, ok := sc.fileCache[filePath]; ok {
		return cached.Mtime == mtime && cached.Size == size
	}

	return false
}

// recordFileScanned records a file as scanned with its current mtime and size.
func (sc *scanContext) recordFileScanned(filePath string, mtime int64, size int64) {
	sc.fileCacheDirty[filePath] = scanCacheEntry{Mtime: mtime, Size: size}
}

// flushFileCache writes all dirty scan cache entries to the database.
func (sc *scanContext) flushFileCache() error {
	if len(sc.fileCacheDirty) == 0 {
		return nil
	}

	stmt, err := sc.tx.Prepare("INSERT OR REPLACE INTO scan_cache(path, mtime, size) VALUES(?, ?, ?)")
	if err != nil {
		return err
	}

	for p, entry := range sc.fileCacheDirty {
		if _, err := stmt.Exec(p, entry.Mtime, entry.Size); err != nil {
			return err
		}
	}

	return nil
}

func (sc *scanContext) beginTransaction() error {
	tx, err := sc.db.Begin()
	if err != nil {
		return err
	}
	sc.tx = tx

	// Prepare all statements once on the new transaction.
	sc.stmtInsertArtist, err = tx.Prepare(insertArtistQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtUpdateArtist, err = tx.Prepare(updateArtistQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtInsertAlbum, err = tx.Prepare(insertAlbumQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtUpdateAlbum, err = tx.Prepare(updateAlbumQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtInsertTrack, err = tx.Prepare(insertTrackQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtUpdateTrack, err = tx.Prepare(updateTrackQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtInsertCover, err = tx.Prepare(insertCoverQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	sc.stmtUpdateCover, err = tx.Prepare(updateCoverQuery)
	if err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

// checkpoint commits the current transaction and opens a new one, preserving
// the in-memory caches.  This keeps SQLite's WAL journal bounded for large
// libraries and persists partial progress.
func (sc *scanContext) checkpoint() error {
	if err := sc.tx.Commit(); err != nil {
		return err
	}

	return sc.beginTransaction()
}

func (sc *scanContext) rollback() {
	sc.tx.Rollback()
}

func (sc *scanContext) commit() error {
	return sc.tx.Commit()
}

// LocalFilesystemRepository implements business.MediaFileRepository.
type LocalFilesystemRepository struct {
	AppContext *AppContext
}

// ScanMediaFiles scans a directory and imports media file metadata and covers into the app.
// If force is true, all files are re-scanned regardless of whether they changed since the last scan.
// The progress pointer, if non-nil, is atomically incremented as files are processed.
// TODO: compute return values.
func (r LocalFilesystemRepository) ScanMediaFiles(scanPath string, force bool, progress *int64) (processed int, added int, err error) {
	log.Println("scan folder " + scanPath)

	sc, err := newScanContext(r.AppContext.DB, force)
	if err != nil {
		return 0, 0, err
	}
	sc.progress = progress

	// Get the artist id of "Various artists" (always created before we start scanning).
	err = sc.tx.
		QueryRow("SELECT id FROM artists WHERE name = ?", business.LibraryDefaultCompilationArtist).
		Scan(&sc.variousArtistsId)
	if err != nil {
		sc.rollback()
		return 0, 0, err
	}

	err = scanDirectory(scanPath, sc)
	if err != nil {
		sc.rollback()
		return 0, 0, err
	}

	// Flush the file scan cache before committing.
	if err = sc.flushFileCache(); err != nil {
		sc.rollback()
		return 0, 0, err
	}

	err = sc.commit()

	return
}

// scanDirectory recursively browses a directory and imports/updates all audio files in the database.
func scanDirectory(dirPath string, sc *scanContext) (err error) {
	if _, err = os.Stat(dirPath); os.IsNotExist(err) {
		return
	}

	currentDir := filepath.Clean(dirPath) + string(os.PathSeparator)

	// Collection of tracks found in the directory indexed by album.
	mediaFiles := make(map[string][]mediaMetadata)

	potentialAlbumCover := ""

	entries, err := os.ReadDir(dirPath)
	if err != nil {
		return
	}

	// audioFile pairs a path with its stat info for cache checking.
	type audioFile struct {
		path  string
		mtime int64
		size  int64
	}

	// Separate subdirectories from files, filtering out unchanged audio files.
	var audioFiles []audioFile
	for _, entry := range entries {
		entryPath := currentDir + entry.Name()

		if entry.IsDir() {
			if err = scanDirectory(entryPath, sc); err != nil {
				return
			}
		} else if isAudioFile(entry.Name()) {
			info, errInfo := entry.Info()
			if errInfo != nil {
				continue
			}
			mtime := info.ModTime().Unix()
			size := info.Size()

			if sc.isFileUnchanged(entryPath, mtime, size) {
				continue // skip — file hasn't changed since last scan
			}
			audioFiles = append(audioFiles, audioFile{path: entryPath, mtime: mtime, size: size})
		} else if potentialAlbumCover == "" && isValidCoverFile(entry.Name()) {
			potentialAlbumCover = entryPath
		}
	}

	// Extract paths for the concurrent reader.
	audioPaths := make([]string, len(audioFiles))
	for i, af := range audioFiles {
		audioPaths[i] = af.path
	}

	// Read metadata concurrently for all changed audio files in this directory.
	metadataResults := readMetadataConcurrently(audioPaths)

	// Record successfully scanned files in the dirty cache.
	// Build a set of paths that produced valid metadata for quick lookup.
	processedPaths := make(map[string]bool, len(metadataResults))
	for _, meta := range metadataResults {
		processedPaths[meta.Path] = true
	}
	for _, af := range audioFiles {
		if processedPaths[af.path] {
			sc.recordFileScanned(af.path, af.mtime, af.size)
		}
	}

	for _, metadata := range metadataResults {
		albumKey := metadata.Album
		if albumKey == "" {
			albumKey = business.LibraryDefaultAlbum
		}
		mediaFiles[albumKey] = append(mediaFiles[albumKey], metadata)
	}

	processMediaFiles(mediaFiles, potentialAlbumCover, sc)

	// Update progress counter: count ALL audio files in this directory (including
	// unchanged/skipped ones) so the progress bar reaches 100%.
	if sc.progress != nil {
		var audioCount int64
		for _, entry := range entries {
			if !entry.IsDir() && isAudioFile(entry.Name()) {
				audioCount++
			}
		}
		atomic.AddInt64(sc.progress, audioCount)
	}

	// Checkpoint: commit and re-open transaction periodically.
	sc.dirsProcessed++
	if sc.dirsProcessed%checkpointInterval == 0 {
		if err = sc.checkpoint(); err != nil {
			return
		}
	}

	return
}

// readMetadataConcurrently reads metadata from multiple files using a worker pool.
func readMetadataConcurrently(paths []string) []mediaMetadata {
	if len(paths) == 0 {
		return nil
	}

	// For very small batches, don't bother with goroutines.
	if len(paths) <= 2 {
		var results []mediaMetadata
		for _, p := range paths {
			if meta, err := getMetadataFromFile(p); err == nil {
				results = append(results, meta)
			}
		}
		return results
	}

	numWorkers := runtime.NumCPU()
	if numWorkers > len(paths) {
		numWorkers = len(paths)
	}

	type result struct {
		meta mediaMetadata
		ok   bool
	}

	// Use indexed results to preserve order.
	results := make([]result, len(paths))

	var wg sync.WaitGroup
	jobs := make(chan int, len(paths))

	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range jobs {
				meta, err := getMetadataFromFile(paths[i])
				if err == nil {
					results[i] = result{meta: meta, ok: true}
				}
			}
		}()
	}

	for i := range paths {
		jobs <- i
	}
	close(jobs)
	wg.Wait()

	var out []mediaMetadata
	for _, r := range results {
		if r.ok {
			out = append(out, r.meta)
		}
	}

	return out
}

func processMediaFiles(mediaFiles map[string][]mediaMetadata, cover string, sc *scanContext) {
	if len(mediaFiles) == 0 {
		return
	}

	// MediaFiles is a map of albums found in one directory.
	uniqueAlbum := len(mediaFiles) < 2
	coverPreferredSource := viper.GetString("Covers.PreferredSource")

	// Process the media files per album.
	for _, album := range mediaFiles {
		if len(album) == 0 {
			continue
		}

		// Detect compilation: if at least 2 tracks have different artists.
		compilation := false
		currentArtist := album[0].Artist
		for i := 1; i < len(album) && !compilation; i++ {
			if album[i].Artist != currentArtist {
				compilation = true
			}
		}

		// Process folder cover once per album (only if there's a single album in the directory).
		var albumCoverId int
		if uniqueAlbum && cover != "" {
			albumCover, errCover := getMediaCoverFromImageFile(cover)
			if errCover != nil {
				log.Println(errCover)
			} else {
				albumCoverId, errCover = processCover(sc, albumCover)
				if errCover != nil {
					log.Println(errCover)
				}
			}
		}

		// If we need a cover from track metadata, extract it once from the first
		// track that has embedded art, rather than re-hashing for every track.
		var metadataCoverId int
		var metadataCoverResolved bool
		if coverPreferredSource == business.CoverPreferredSourceMediaFile || albumCoverId == 0 {
			for _, metadataTrack := range album {
				trackCover, errCover := getMediaCoverFromTrackMetadata(metadataTrack)
				if errCover == nil {
					metadataCoverId, errCover = processCover(sc, trackCover)
					if errCover != nil {
						log.Println(errCover)
					}
					metadataCoverResolved = true
					break
				}
			}
		}

		// Now process each track.
		for _, metadataTrack := range album {
			if compilation {
				metadataTrack.AlbumArtist = business.LibraryDefaultCompilationArtist
			}

			artistId, _ := processArtist(sc, &metadataTrack)

			albumArtistId := artistId
			if compilation {
				albumArtistId = sc.variousArtistsId
			}

			albumId, _ := processAlbum(sc, &metadataTrack, albumArtistId, albumCoverId)

			// Determine the cover to attach to this track.
			trackCoverId := albumCoverId
			if metadataCoverResolved && (coverPreferredSource == business.CoverPreferredSourceMediaFile || albumCoverId == 0) {
				trackCoverId = metadataCoverId
			}

			processTrack(sc, &metadataTrack, artistId, albumId, trackCoverId)
		}
	}
}

// MediaFileExists checks if a media file physically exists and is still
// considered an audio file, so that files now ignored by the scanner are
// removed from the library.
func (r LocalFilesystemRepository) MediaFileExists(filepath string) bool {
	return isAudioFile(filepath) && fileExists(filepath)
}

// WriteCoverFile writes a cover image.
func (r LocalFilesystemRepository) WriteCoverFile(file *domain.Cover, directory string) error {
	return writeCoverFile(file, directory)
}

// RemoveCoverFile deletes a cover image.
func (r LocalFilesystemRepository) RemoveCoverFile(file *domain.Cover, directory string) error {
	srcFileName := directory + string(os.PathSeparator) + file.Hash + file.Ext
	return os.Remove(srcFileName)
}

// DeleteCovers deletes all covers
func (r LocalFilesystemRepository) DeleteCovers() error {
	return os.RemoveAll(viper.GetString("Covers.Directory"))
}

// CountAudioFiles counts all audio files under the given path, recursively.
// This is a fast directory walk (no file I/O) used for progress estimation.
func (r LocalFilesystemRepository) CountAudioFiles(rootPath string) int {
	count := 0
	_ = filepath.WalkDir(rootPath, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if !d.IsDir() && isAudioFile(d.Name()) {
			count++
		}

		return nil
	})

	return count
}

// processArtist saves an artist info in the database, using the in-memory cache
// to skip redundant lookups.
func processArtist(sc *scanContext, metadata *mediaMetadata) (id int, err error) {
	if metadata.Artist == "" {
		return 0, errors.New("no artist to process")
	}

	// Check cache first.
	if cachedId, ok := sc.artistCache[metadata.Artist]; ok {
		return cachedId, nil
	}

	artist, _ := getArtistByNameTransaction(sc.tx, metadata.Artist)
	artist.Name = metadata.Artist

	err = saveArtistWithStmt(sc, &artist)
	if err == nil {
		id = artist.Id
		sc.artistCache[metadata.Artist] = id
	}

	return id, err
}

// processAlbum saves an album info in the database, using the in-memory cache.
func processAlbum(sc *scanContext, metadata *mediaMetadata, artistId int, coverId int) (id int, err error) {
	if metadata.Album == "" {
		return 0, errors.New("no album to process")
	}

	cacheKey := fmt.Sprintf("%s\x00%d", metadata.Album, artistId)

	if cachedId, ok := sc.albumCache[cacheKey]; ok {
		return cachedId, nil
	}

	album, _ := getAlbumByNameAndArtistTransaction(sc.tx, metadata.Album, artistId)
	album.Title = metadata.Album
	album.ArtistId = artistId
	album.Year = metadata.Year
	album.CoverId = coverId

	err = saveAlbumWithStmt(sc, &album)
	if err == nil {
		id = album.Id
		sc.albumCache[cacheKey] = id
	}

	return id, err
}

// processTrack saves a track info in the database.
func processTrack(sc *scanContext, metadata *mediaMetadata, artistId int, albumId int, coverId int) (id int, err error) {
	track, _ := getTrackByPathTransaction(sc.tx, metadata.Path)

	track.ArtistId = artistId
	track.AlbumId = albumId
	track.CoverId = coverId
	track.Title = metadata.Title
	track.Number = metadata.Track
	track.Disc = metadata.Disc
	track.Genre = metadata.Genre
	track.Duration = metadata.Duration
	track.Path = metadata.Path

	err = saveTrackWithStmt(sc, &track)
	if err == nil {
		id = track.Id
	}

	return
}

// processCover saves a cover info in the database and filesystem, using the
// in-memory cache to avoid redundant hash lookups.
func processCover(sc *scanContext, cover domain.Cover) (id int, err error) {
	cover.Path = cover.Hash + cover.Ext

	// Check cache first.
	if cachedId, ok := sc.coverCache[cover.Hash]; ok {
		return cachedId, nil
	}

	coverFromDb, err := getCoverByNameTransaction(sc.tx, cover.Hash)
	if err == nil {
		id = coverFromDb.Id
		sc.coverCache[cover.Hash] = id
		return
	}

	err = saveCoverWithStmt(sc, &cover)
	if err == nil && cover.Id != 0 {
		id = cover.Id
		sc.coverCache[cover.Hash] = id
		err = writeCoverFile(&cover, viper.GetString("Covers.Directory"))
	}

	return
}

// Save helpers that use prepared statements instead of preparing each time.

func saveArtistWithStmt(sc *scanContext, entity *domain.Artist) error {
	if entity.Id != 0 {
		_, err := sc.stmtUpdateArtist.Exec(entity.Name, entity.Id)
		return err
	}

	entity.DateAdded = timeNow()
	res, err := sc.stmtInsertArtist.Exec(entity.Name, entity.DateAdded)
	if err != nil {
		return err
	}
	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}
	entity.Id = int(lastId)

	return nil
}

func saveAlbumWithStmt(sc *scanContext, entity *domain.Album) error {
	if entity.Id != 0 {
		_, err := sc.stmtUpdateAlbum.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.Id)
		return err
	}

	entity.DateAdded = timeNow()
	res, err := sc.stmtInsertAlbum.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.DateAdded)
	if err != nil {
		return err
	}
	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}
	entity.Id = int(lastId)

	return nil
}

func saveTrackWithStmt(sc *scanContext, entity *domain.Track) error {
	if entity.Id != 0 {
		_, err := sc.stmtUpdateTrack.Exec(
			entity.Title, entity.AlbumId, entity.ArtistId, entity.CoverId,
			entity.Disc, entity.Number, entity.Duration, entity.Genre, entity.Path,
			entity.Id,
		)
		return err
	}

	entity.DateAdded = timeNow()
	res, err := sc.stmtInsertTrack.Exec(
		entity.Title, entity.AlbumId, entity.ArtistId, entity.CoverId,
		entity.Disc, entity.Number, entity.Duration, entity.Genre, entity.Path,
		entity.DateAdded,
	)
	if err != nil {
		return err
	}
	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}
	entity.Id = int(lastId)

	return nil
}

func saveCoverWithStmt(sc *scanContext, entity *domain.Cover) error {
	if entity.Id != 0 {
		_, err := sc.stmtUpdateCover.Exec(entity.Path, entity.Hash, entity.Id)
		return err
	}

	res, err := sc.stmtInsertCover.Exec(entity.Path, entity.Hash)
	if err != nil {
		return err
	}
	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}
	entity.Id = int(lastId)

	return nil
}

func timeNow() int64 {
	return time.Now().Unix()
}

// isAudioFile checks if a filename has a supported audio extension.
// macOS metadata files ("._<name>", created on non-HFS volumes) are excluded.
func isAudioFile(filename string) bool {
	if strings.HasPrefix(filepath.Base(filename), "._") {
		return false
	}
	ext := strings.ToLower(filepath.Ext(filename))

	return validAudioExtensions[ext]
}

// getMetadataFromFile gets media metadata from a file.
// Uses TagLib (go-taglib), which computes the duration from the audio stream
// instead of trusting the length stored in the tags.
func getMetadataFromFile(filePath string) (info mediaMetadata, err error) {
	if _, err = os.Stat(filePath); err != nil {
		return
	}

	props, errProps := taglib.ReadProperties(filePath)
	// TagLib returns empty properties without an error for files it can't parse.
	if errProps == nil && props.SampleRate == 0 {
		errProps = errors.New("unsupported or corrupted audio file")
	}
	if errProps != nil {
		log.Println("ERROR - Can't read audio properties of " + filePath)
	} else {
		info.Format = props.Format
		info.Duration = int(props.Length.Round(time.Second).Seconds())
	}

	tags, errTags := taglib.ReadTags(filePath)
	if errTags != nil {
		log.Println("ERROR - Can't read tags of " + filePath)
	}

	if errTags == nil {
		var artist = firstTagValue(tags, taglib.Artist)
		if len(artist) == 0 {
			artist = business.LibraryDefaultArtist
		}

		info.Title = firstTagValue(tags, taglib.Title)
		info.Album = firstTagValue(tags, taglib.Album)
		info.AlbumArtist = firstTagValue(tags, taglib.AlbumArtist)
		info.Artist = artist
		info.Genre = joinTagValues(tags, taglib.Genre)
		if year := parseYear(firstTagValue(tags, taglib.Date)); year != 0 {
			info.Year = strconv.Itoa(year)
		}
		info.Track, _ = parseNumberAndTotal(firstTagValue(tags, taglib.TrackNumber))

		number, total := parseNumberAndTotal(firstTagValue(tags, taglib.DiscNumber))
		if total == 0 {
			total, _ = strconv.Atoi(firstTagValue(tags, "DISCTOTAL"))
		}
		if total > 1 {
			info.Disc = strconv.Itoa(number) + "/" + strconv.Itoa(total)
		}
	}

	// Only read the image when there is one, as each read parses the file again.
	if errProps == nil && len(props.Images) > 0 {
		data, errImage := taglib.ReadImage(filePath)
		if errImage == nil && len(data) > 0 {
			if ext, ok := imageExtension(data, props.Images[0].MIMEType); ok {
				info.Picture = &embeddedPicture{Ext: ext, Data: data}
			} else {
				log.Println("ERROR - Unsupported embedded image type in " + filePath)
			}
		}
	}

	// If the track has no title, fallback to the filename.
	if info.Title == "" {
		_, f := path.Split(filePath)
		extension := filepath.Ext(f)
		filename := filepath.Base(f)
		info.Title = filename[0 : len(filename)-len(extension)]
	}

	info.Path = filePath

	return
}

// getMediaCoverFromImageFile gets media cover from file.
func getMediaCoverFromImageFile(coverFilepath string) (cover domain.Cover, err error) {
	if fileExists(coverFilepath) {
		if isValidCoverFile(filepath.Base(coverFilepath)) {
			fileContent, errRead := os.ReadFile(coverFilepath)
			if errRead == nil {
				reader := bytes.NewReader(fileContent)
				hash, errSum := md5Checksum(reader)
				if errSum == nil {
					cover.Ext = filepath.Ext(coverFilepath)
					cover.Hash = hash
					cover.Content = fileContent

					return cover, nil
				}
			}
		}
	}

	return cover, errors.New("invalid cover image file")
}

func isValidCoverFile(filename string) bool {
	for _, name := range validCoverNames {
		for _, ext := range validCoverExtensions {
			if matched, _ := filepath.Match(name+ext, strings.ToLower(filename)); matched {
				return true
			}
		}
	}

	return false
}

// getMediaCoverFromTrackMetadata gets media cover from media file metadata.
func getMediaCoverFromTrackMetadata(trackMetadata mediaMetadata) (cover domain.Cover, err error) {
	if trackMetadata.Picture != nil {
		reader := bytes.NewReader(trackMetadata.Picture.Data)
		hash, errSum := md5Checksum(reader)
		if errSum == nil {
			cover.Ext = "." + trackMetadata.Picture.Ext
			cover.Hash = hash
			cover.Content = trackMetadata.Picture.Data

			return
		}
	}

	return cover, errors.New("no cover found in track metadata")
}

func writeCoverFile(file *domain.Cover, directory string) error {
	if _, err := os.Stat(directory); os.IsNotExist(err) {
		os.MkdirAll(directory, 0777)
	}

	destFileName := directory + string(os.PathSeparator) + file.Hash + file.Ext
	return os.WriteFile(destFileName, file.Content, 0777)
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func md5Checksum(reader io.Reader) (hash string, err error) {
	hasher := md5.New()
	_, err = io.Copy(hasher, reader)
	if err != nil {
		return
	}

	hash = hex.EncodeToString(hasher.Sum(nil))
	return
}

func sanitizeString(s string) string {
	return strings.Trim(strings.TrimSpace(s), "\x00")
}

// firstTagValue returns the first sanitized value of a tag, or "" if absent.
func firstTagValue(tags map[string][]string, key string) string {
	if values := tags[key]; len(values) > 0 {
		return sanitizeString(values[0])
	}

	return ""
}

// joinTagValues returns all the non-empty sanitized values of a tag joined
// with "; ", or "" if absent.
func joinTagValues(tags map[string][]string, key string) string {
	var values []string
	for _, value := range tags[key] {
		if value = sanitizeString(value); value != "" {
			values = append(values, value)
		}
	}

	return strings.Join(values, "; ")
}

// parseNumberAndTotal parses tag values formatted as "<number>" or "<number>/<total>".
func parseNumberAndTotal(value string) (number int, total int) {
	numberPart, totalPart, _ := strings.Cut(value, "/")
	number, _ = strconv.Atoi(strings.TrimSpace(numberPart))
	total, _ = strconv.Atoi(strings.TrimSpace(totalPart))

	return
}

// parseYear extracts the year from a date tag such as "2017" or "2017-05-21".
func parseYear(date string) int {
	if len(date) < 4 {
		return 0
	}
	year, _ := strconv.Atoi(date[:4])

	return year
}

// coverImageExtensions maps the image types accepted for embedded covers to the
// extension they are saved with, which determines the Content-Type they are
// served with. SVG is deliberately excluded as it can embed scripts.
var coverImageExtensions = map[string]string{
	"image/jpeg": "jpg",
	"image/png":  "png",
	"image/gif":  "gif",
	"image/webp": "webp",
	"image/bmp":  "bmp",
	"image/avif": "avif",
}

// imageExtension returns the extension of an embedded image, derived from its
// content, or from its declared MIME type for formats that can't be sniffed
// (e.g. AVIF). Returns false if the image type is unsupported or unknown.
func imageExtension(data []byte, mimeType string) (string, bool) {
	if ext, ok := coverImageExtensions[http.DetectContentType(data)]; ok {
		return ext, true
	}
	ext, ok := coverImageExtensions[strings.ToLower(strings.TrimSpace(mimeType))]

	return ext, ok
}
