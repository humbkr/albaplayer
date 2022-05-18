package interfaces

import (
	"bytes"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"errors"
	"github.com/dhowden/tag"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/spf13/viper"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
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
	Picture     *tag.Picture
	Duration    int
	Path        string
}

// LocalFilesystemRepository implements business.MediaFileRepository.
type LocalFilesystemRepository struct {
	AppContext *AppContext
}

// ScanMediaFiles scans a directory and import media files metadata and cover into the app.
// TODO: compute return values.
func (r LocalFilesystemRepository) ScanMediaFiles(path string) (processed int, added int, err error) {
	log.Println("scan folder " + path)

	dbTransaction, _ := r.AppContext.DB.Begin()

	// Get the artist id of "Various artists" (always created before we start scanning).
	var variousArtistsId int
	err = dbTransaction.
		QueryRow("SELECT id FROM artists WHERE name = ?", business.LibraryDefaultCompilationArtist).
		Scan(&variousArtistsId)
	if err != nil {
		dbTransaction.Rollback()
		return 0, 0, err
	}

	err = scanDirectory(path, variousArtistsId, dbTransaction)
	if err != nil {
		dbTransaction.Rollback()
		return 0, 0, err
	}

	err = dbTransaction.Commit()

	return
}

// scanDirectory recursively browses a directory and import / update all the audio files in the database.
func scanDirectory(path string, variousArtistsId int, dbTransaction *sql.Tx) (err error) {
	if _, err = os.Stat(path); os.IsNotExist(err) {
		return
	}

	currentDir := filepath.Clean(path) + string(os.PathSeparator)

	// Collection of tracks found in the directory indexed by album.
	mediaFiles := make(map[string][]mediaMetadata)

	potentialAlbumCover := ""

	// Get all the entries in the current directory.
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return
	}

	for _, file := range files {
		filePath := currentDir + file.Name()

		if file.IsDir() {
			// Recursion.
			scanDirectory(filePath, variousArtistsId, dbTransaction)
		} else if matched, _ := filepath.Match("*.mp3", strings.ToLower(file.Name())); matched {
			// Get ID3 metadata and add it to an array.
			metadata, err := getMetadataFromFile(filePath)
			if err == nil {
				// Add metadata info to the list of media files, sorting by albums.
				if len(metadata.Album) > 0 {
					mediaFiles[metadata.Album] = append(mediaFiles[metadata.Album], metadata)
				} else {
					mediaFiles[business.LibraryDefaultAlbum] = append(mediaFiles[business.LibraryDefaultAlbum], metadata)
				}
			}
		} else if len(potentialAlbumCover) == 0 && isValidCoverFile(file.Name()) {
			// It's a good candidate for an album cover, so keep it.
			potentialAlbumCover = filePath
		}
	}

	processMediaFiles(mediaFiles, potentialAlbumCover, variousArtistsId, dbTransaction)

	return
}

func processMediaFiles(mediaFiles map[string][]mediaMetadata, cover string, variousArtistsId int, dbTransaction *sql.Tx) {
	// MediaFiles is a map of albums found in one directory.
	uniqueAlbum := len(mediaFiles) < 2

	// Process the media files per album.
	for _, album := range mediaFiles {

		// Here we try to figure out if the album is a compilation or not.
		// If at least 2 of the tracks have different artists, this must be a compilation.
		compilation := false
		currentArtist := album[0].Artist
		for i := 1; i < len(album) && !compilation; i++ {
			if album[i].Artist != currentArtist {
				compilation = true
			}
		}

		// If there is only one album in the directory and we found a valid cover file, in this same directory,
		// we can directly add the cover to the database.
		// If there are multiple albums in the directory, we will use track info to try to get a cover.
		var albumCoverId int
		if uniqueAlbum && len(cover) > 0 {
			albumCover, errCover := getMediaCoverFromImageFile(cover)
			if errCover != nil {
				// TODO devise a decent logging system.
				log.Println(errCover)
			} else {
				albumCoverId, errCover = processCover(dbTransaction, albumCover)
				if errCover != nil {
					// TODO devise a decent logging system.
					log.Println(errCover)
				}
			}
		}

		// Now we process the metadata to populate the library.
		for _, metadataTrack := range album {
			if compilation {
				metadataTrack.AlbumArtist = business.LibraryDefaultCompilationArtist
			}

			var artistId int
			var albumId int

			artistId, _ = processArtist(dbTransaction, &metadataTrack)

			albumArtistId := artistId
			if compilation {
				albumArtistId = variousArtistsId
			}

			albumId, _ = processAlbum(dbTransaction, &metadataTrack, albumArtistId, albumCoverId)

			// Find out what cover we can set for the track based on config preferences.
			coverPreferredSource := viper.GetString("Covers.PreferredSource")

			// Default to the one we may have found previously in the folder if there is tracks from one album only.
			var trackCoverId = albumCoverId
			// Look for a cover in the metadata if user prefers it this way or no folder cover has been found.
			if coverPreferredSource == business.CoverPreferredSourceMediaFile || albumCoverId == 0 {
				// Track metadata has priority, so try to find a cover in metadata.
				trackCover, err := getMediaCoverFromTrackMetadata(metadataTrack)
				if err == nil {
					// Found one, use it.
					trackCoverId, err = processCover(dbTransaction, trackCover)
					if err != nil {
						// TODO devise a decent logging system.
						log.Println(err)
					}
				}
			}

			processTrack(dbTransaction, &metadataTrack, artistId, albumId, trackCoverId)
		}
	}
}

// MediaFileExists checks if a media file physically exists.
func (r LocalFilesystemRepository) MediaFileExists(filepath string) bool {
	return fileExists(filepath)
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

// processArtist saves an artist info in the database.
// Returns an artist id.
func processArtist(dbTransaction *sql.Tx, metadata *mediaMetadata) (id int, err error) {
	// Process artist if any.
	if metadata.Artist != "" {
		// See if the artist exists and if so instantiate it with existing data.
		artist, _ := getArtistByNameTransaction(dbTransaction, metadata.Artist)

		artist.Name = metadata.Artist

		err = saveArtistTransaction(dbTransaction, &artist)
		if err == nil {
			id = artist.Id
		}

		return id, err
	}

	return 0, errors.New("no artist to process")
}

// processAlbum saves an album info in the database.
// Returns an album id.
func processAlbum(dbTransaction *sql.Tx, metadata *mediaMetadata, artistId int, coverId int) (id int, err error) {
	if metadata.Album != "" {
		// See if the album exists and if so instantiate it with existing data.
		album, _ := getAlbumByNameTransaction(dbTransaction, metadata.Album)

		album.Title = metadata.Album
		album.ArtistId = artistId
		// TODO Track all the years from an album tracks and compute the final value (improvement).
		album.Year = metadata.Year
		album.CoverId = coverId

		err = saveAlbumTransaction(dbTransaction, &album)
		if err == nil {
			id = album.Id
		}

		return id, err
	}

	return 0, errors.New("no album to process")
}

// processTrack saves a track info in the database.
// Returns a track id.
func processTrack(dbTransaction *sql.Tx, metadata *mediaMetadata, artistId int, albumId int, coverId int) (id int, err error) {
	// See if the track exists and if so instantiate it with existing data.
	track, _ := getTrackByNameTransaction(dbTransaction, metadata.Title)

	track.ArtistId = artistId
	track.AlbumId = albumId
	track.CoverId = coverId
	track.Title = metadata.Title
	track.Number = metadata.Track
	track.Disc = metadata.Disc
	track.Genre = metadata.Genre
	track.Duration = metadata.Duration
	track.Path = metadata.Path

	err = saveTrackTransaction(dbTransaction, &track)
	if err == nil {
		id = track.Id
	}

	return
}

// processCover saves a cover info in the database and filesystem.
// Returns a cover id.
func processCover(dbTransaction *sql.Tx, cover domain.Cover) (id int, err error) {
	cover.Path = cover.Hash + cover.Ext

	coverFromDb, err := getCoverByNameTransaction(dbTransaction, cover.Hash)
	if err == nil {
		// Nothing to do about the cover, just return the cover id to be used to link it to the track.
		id = coverFromDb.Id

		return
	}

	// Else we have to add a new cover in the database.
	err = saveCoverTransaction(dbTransaction, &cover)
	// And to the filesystem.
	if err == nil && cover.Id != 0 {
		id = cover.Id
		// Save image file.
		err = writeCoverFile(&cover, viper.GetString("Covers.Directory"))
	}

	return
}

// getMetadataFromFile gets media metadata from a file.
// Uses multiple libraries to get a maximum of info depending on the format.
func getMetadataFromFile(filePath string) (info mediaMetadata, err error) {
	file, err := os.OpenFile(filePath, os.O_RDONLY, 0666)
	defer file.Close()

	if err != nil {
		return
	}

	tags, errTags := tag.ReadFrom(file)
	if errTags != nil {
		log.Println("ERROR - Can't read id3 tags of " + filePath)
	}

	if errTags == nil {
		var artist = sanitizeString(tags.Artist())
		if len(artist) == 0 {
			artist = business.LibraryDefaultArtist
		}

		// Get all we can from the common tags.
		info.Format = string(tags.FileType())
		info.Title = sanitizeString(tags.Title())
		info.Album = sanitizeString(tags.Album())
		info.AlbumArtist = sanitizeString(tags.AlbumArtist())
		info.Artist = artist
		info.Genre = sanitizeString(tags.Genre())
		if tags.Year() != 0 {
			info.Year = strconv.Itoa(tags.Year())
		}
		info.Track, _ = tags.Track()
		info.Picture = tags.Picture()

		number, total := tags.Disc()
		// Don't store disc info if there's only one disc.
		if total > 1 {
			info.Disc = strconv.Itoa(number) + "/" + strconv.Itoa(total)
		}
	}

	// If the track has no title, fallback to the filename.
	if info.Title == "" {
		_, f := path.Split(filePath)
		extension := filepath.Ext(f)
		filename := filepath.Base(f)
		info.Title = filename[0 : len(filename)-len(extension)]
	}

	// Set the filepath.
	info.Path = filePath

	return
}

// getMediaCoverFromImageFile gets media cover from file.
// Returns the info for the first image file that matches.
func getMediaCoverFromImageFile(coverFilepath string) (cover domain.Cover, err error) {
	if fileExists(coverFilepath) {
		if isValidCoverFile(filepath.Base(coverFilepath)) {
			fileContent, errRead := ioutil.ReadFile(coverFilepath)
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
// Returns cover info if found.
func getMediaCoverFromTrackMetadata(trackMetadata mediaMetadata) (cover domain.Cover, err error) {
	if trackMetadata.Picture != nil {
		reader := bytes.NewReader(trackMetadata.Picture.Data)
		hash, errSum := md5Checksum(reader)
		if errSum == nil {
			// TODO Change this "hack".
			if trackMetadata.Picture.Ext == "" {
				cover.Ext = ".jpg"
			} else {
				cover.Ext = "." + trackMetadata.Picture.Ext
			}
			cover.Hash = hash
			cover.Content = trackMetadata.Picture.Data

			return
		}
	}

	return cover, errors.New("no cover found in track metadata")
}

// Writes a cover image to disk.
func writeCoverFile(file *domain.Cover, directory string) error {
	if _, err := os.Stat(directory); os.IsNotExist(err) {
		os.MkdirAll(directory, 0777)
	}

	destFileName := directory + string(os.PathSeparator) + file.Hash + file.Ext
	return ioutil.WriteFile(destFileName, file.Content, 0777)
}

// Checks if a file exists on disk.
func fileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

// Computes the checksum of a stream of content.
func md5Checksum(reader io.Reader) (hash string, err error) {
	hasher := md5.New()
	_, err = io.Copy(hasher, reader)
	if err != nil {
		return
	}

	hash = hex.EncodeToString(hasher.Sum(nil))
	return
}

// Removes spaces and nul character from a string.
func sanitizeString(s string) string {
	return strings.Trim(strings.TrimSpace(s), "\x00")
}
