package business

import (
	"errors"
	"sync"
	"time"

	"github.com/humbkr/albaplayer-server/internal/alba/domain"
	"github.com/spf13/viper"
)

const CoverPreferredSourceFolder = "folder"
const CoverPreferredSourceMediaFile = "file"
const LibraryDefaultArtist = "Unknown artist"
const LibraryDefaultAlbum = "Unknown album"
const LibraryDefaultCompilationArtist = "Various artists"

type LibraryInteractor struct {
	ArtistRepository  ArtistRepository
	AlbumRepository AlbumRepository
	TrackRepository TrackRepository
	CoverRepository CoverRepository
	// TODO Check if the library repo should be an interface here.
	LibraryRepository LibraryRepository
	MediaFileRepository MediaFileRepository
	InternalVariableRepository InternalVariableRepository
	mutex sync.Mutex
	LibraryIsUpdating bool
}

// Gets an artist by id.
//
// If no artist found, returns an error.
func (interactor *LibraryInteractor) GetArtist(artistId int) (domain.Artist, error) {
	return interactor.ArtistRepository.Get(artistId)
}

// Gets an artist by name.
//
// If no artist found, returns an error.
func (interactor *LibraryInteractor) GetArtistByName(artistName string) (domain.Artist, error) {
	return interactor.ArtistRepository.GetByName(artistName)
}


// Gets all artists.
//
// If no artists found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllArtists(hydrate bool) (domain.Artists, error) {
	return interactor.ArtistRepository.GetAll(hydrate)
}

// Saves an artist.
//
// Returns an error if the artist's name is empty.
func (interactor *LibraryInteractor) SaveArtist(artist *domain.Artist) error {
	if artist.Name == "" {
		return errors.New("cannot save artist: empty name")
	}

	return interactor.ArtistRepository.Save(artist)
}

// Deletes an artist.
//
// Returns an error if no artistId provided.
func (interactor *LibraryInteractor) DeleteArtist(artist *domain.Artist) error {
	if artist.Id == 0 {
		return errors.New("cannot delete artist: id not provided")
	}
	return interactor.ArtistRepository.Delete(artist)
}

// Checks if an artist exists or not.
func (interactor *LibraryInteractor) ArtistExists(artistId int) bool {
	return interactor.ArtistRepository.Exists(artistId)
}

// Gets an album from its id.
//
// If no album found, returns an error.
func (interactor *LibraryInteractor) GetAlbum(albumId int) (domain.Album, error) {
	return interactor.AlbumRepository.Get(albumId)
}

// Gets all albums.
//
// If no albums found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllAlbums(hydrate bool) (domain.Albums, error) {
	return interactor.AlbumRepository.GetAll(hydrate)
}

// Get all albums for a given artist.
//
// If hydrate == true, the albums tracks will be populated.
// If the artist doesnt exists, return an error.
func (interactor *LibraryInteractor) GetAlbumsForArtist(artistId int, hydrate bool) (domain.Albums, error) {
	if !interactor.ArtistExists(artistId) {
		return domain.Albums{}, errors.New("cannot get albums: invalid artist ID")
	}
	return interactor.AlbumRepository.GetAlbumsForArtist(artistId, hydrate)
}

// Saves an album.
//
// An album cannot be saved without a title or if the related artist, if any, doesn't exists.
func (interactor *LibraryInteractor) SaveAlbum(album *domain.Album) error {
	invalid := false
	var message string
	if album.Title == "" {
		invalid = true
		message = "cannot save album: empty title"
	}
	if album.ArtistId != 0 {
		if !interactor.ArtistExists(album.ArtistId) {
			invalid = true
			message = "cannot save album: invalid artist ID"
		}
	}

	if invalid {
		return errors.New(message)
	}

	return interactor.AlbumRepository.Save(album)
}

// Deletes an album.
//
// Returns an error if no albumId provided.
func (interactor *LibraryInteractor) DeleteAlbum(album *domain.Album) error {
	if album.Id == 0 {
		return errors.New("cannot delete album: id not provided")
	}

	return interactor.AlbumRepository.Delete(album)
}

// Checks if an album exists or not.
func (interactor *LibraryInteractor) AlbumExists(albumId int) bool {
	return interactor.AlbumRepository.Exists(albumId)
}

// Gets atrack from its id.
//
// If no track found, returns an error.
func (interactor *LibraryInteractor) GetTrack(trackId int) (domain.Track, error) {
	return interactor.TrackRepository.Get(trackId)
}

// Gets all tracks.
//
// If no tracks found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllTracks() (domain.Tracks, error) {
	return interactor.TrackRepository.GetAll()
}

// Get all tracks for a given album.
//
// If the album doesn't exists, return an error
func (interactor *LibraryInteractor) GetTracksForAlbum(albumId int) (domain.Tracks, error) {
	if !interactor.AlbumExists(albumId) {
		return domain.Tracks{}, errors.New("cannot get tracks: invalid album ID")
	}

	return interactor.TrackRepository.GetTracksForAlbum(albumId)
}

// Saves a track.
//
// A track cannot be saved without a title or if the related artist or album, if any, doesn't exists.
func (interactor *LibraryInteractor) SaveTrack(track *domain.Track) error {
	invalid := false
	var message string
	if track.Title == "" {
		invalid = true
		message = "cannot save track: empty title"
	}
	if track.Path == "" {
		invalid = true
		message = "cannot save track: empty path"
	}
	if track.ArtistId != 0 {
		if _, err := interactor.GetArtist(track.ArtistId); err != nil {
			invalid = true
			message = "cannot save track: invalid artist ID"
		}
	}
	if track.AlbumId != 0 {
		if _, err := interactor.GetAlbum(track.AlbumId); err != nil {
			invalid = true
			message = "cannot save track: invalid album ID"
		}
	}

	if invalid {
		return errors.New(message)
	}

	return interactor.TrackRepository.Save(track)
}

// Deletes a track.
//
// Returns an error if no trackId provided.
func (interactor *LibraryInteractor) DeleteTrack(track *domain.Track) error {
	if track.Id == 0 {
		return errors.New("cannot delete track: id not provided")
	}

	return interactor.TrackRepository.Delete(track)
}

// Checks if a track exists or not.
func (interactor *LibraryInteractor) TrackExists(trackId int) bool {
	return interactor.TrackRepository.Exists(trackId)
}

// Saves a cover.
func (interactor *LibraryInteractor) SaveCover(cover *domain.Cover) error {
	invalid := false
	var message string
	if cover.Hash == "" {
		invalid = true
		message = "cannot save cover: empty hash"
	}
	if cover.Path == "" {
		invalid = true
		message = "cannot save cover: empty path"
	}

	if invalid {
		return errors.New(message)
	}

	coverId := interactor.CoverHashExists(cover.Hash)
	if coverId != 0 {
		// It becomes an update.
		cover.Id = coverId
	}

	// Save cover info to database.
	err := interactor.CoverRepository.Save(cover)
	if err == nil && coverId != 0 {
		// Save image file.
		err = interactor.MediaFileRepository.WriteCoverFile(cover, viper.GetString("Covers.Directory"))
	}

	return err
}

// Deletes a cover.
func (interactor *LibraryInteractor) DeleteCover(cover *domain.Cover) error {
	if cover.Id == 0 {
		return errors.New("cannot delete cover: id not provided")
	}

	// Delete cover info from database.
	err := interactor.CoverRepository.Delete(cover)
	if err == nil {
		// Remove image file.
		err = interactor.MediaFileRepository.RemoveCoverFile(cover, viper.GetString("Covers.Directory"))
	}

	return err
}

// Checks if a cover exists or not.
func (interactor *LibraryInteractor) CoverExists(coverId int) bool {
	return interactor.CoverRepository.Exists(coverId)
}

// Checks if a cover exists or not by hash.
//
// Returns cover.Id if exists, else 0.
func (interactor *LibraryInteractor) CoverHashExists(hash string) int {
	return interactor.CoverRepository.ExistsByHash(hash)
}

// Populates library.
func (interactor *LibraryInteractor) UpdateLibrary() {
	interactor.mutex.Lock()
	interactor.LibraryIsUpdating = true

	_ = interactor.CreateCompilationArtist()
	_, _, _ = interactor.MediaFileRepository.ScanMediaFiles(viper.GetString("Library.Path"))
	interactor.CleanUpLibrary()

	// Log the last time a scan occurred.
	var lastUpdated = InternalVariable{
		Key: "library_last_updated",
		Value: time.Now().Format("20060102150405"),
	}
	_ = interactor.InternalVariableRepository.Save(&lastUpdated)

	interactor.LibraryIsUpdating = false
	interactor.mutex.Unlock()
}

// Removes all data from library.
func (interactor *LibraryInteractor) EraseLibrary() {
	interactor.mutex.Lock()
	interactor.LibraryIsUpdating = true

	interactor.LibraryRepository.Erase()
	_ = interactor.MediaFileRepository.DeleteCovers()

	interactor.LibraryIsUpdating = false
	interactor.mutex.Unlock()
}

// Removes all dead files from library.
// Also removes unused albums and artists.
func (interactor *LibraryInteractor) CleanUpLibrary() {
	tracks, err := interactor.GetAllTracks()
	if err == nil {
		// Delete non existant tracks.
		for _, track := range tracks {
			if !interactor.MediaFileRepository.MediaFileExists(track.Path) {
				_ = interactor.DeleteTrack(&track)
			}
		}
	}

	// Delete albums if no more tracks in them.
	_ = interactor.AlbumRepository.CleanUp()

	// Delete artists if no more tracks from them.
	_ = interactor.ArtistRepository.CleanUp()
}

// Create a common artist for compilations.
func (interactor *LibraryInteractor) CreateCompilationArtist() error {
	_, err := interactor.GetArtistByName(LibraryDefaultCompilationArtist)
	if err != nil {
		compilationArtist := domain.Artist{Name: LibraryDefaultCompilationArtist}
		return interactor.SaveArtist(&compilationArtist)
	}

	return err
}
