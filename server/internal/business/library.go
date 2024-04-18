package business

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/spf13/viper"
)

const CoverPreferredSourceFolder = "folder"
const CoverPreferredSourceMediaFile = "file"
const LibraryDefaultArtist = "Unknown artist"
const LibraryDefaultAlbum = "Unknown album"
const LibraryDefaultCompilationArtist = "Various artists"

type LibraryInteractor struct {
	ArtistRepository     ArtistRepository
	AlbumRepository      AlbumRepository
	TrackRepository      TrackRepository
	CoverRepository      CoverRepository
	CollectionRepository CollectionRepository
	// TODO Check if the library repo should be an interface here.
	LibraryRepository          LibraryRepository
	MediaFileRepository        MediaFileRepository
	InternalVariableRepository InternalVariableRepository
	mutex                      sync.Mutex
	LibraryIsUpdating          bool
}

// GetArtist gets an artist by id.
// If no artist found, returns an error.
func (interactor *LibraryInteractor) GetArtist(artistId int, hydrate bool) (domain.Artist, error) {
	return interactor.ArtistRepository.Get(artistId, hydrate)
}

// GetArtistByName gets an artist by name.
// If no artist found, returns an error.
func (interactor *LibraryInteractor) GetArtistByName(artistName string) (domain.Artist, error) {
	return interactor.ArtistRepository.GetByName(artistName)
}

// GetAllArtists gets all artists.
// If no artists found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllArtists(hydrate bool) ([]domain.Artist, error) {
	return interactor.ArtistRepository.GetAll(hydrate)
}

// SaveArtist saves an artist.
// Returns an error if the artist's name is empty.
func (interactor *LibraryInteractor) SaveArtist(artist *domain.Artist) error {
	if artist.Name == "" {
		return errors.New("cannot save artist: empty name")
	}

	return interactor.ArtistRepository.Save(artist)
}

// DeleteArtist deletes an artist.
// Returns an error if no artistId provided.
func (interactor *LibraryInteractor) DeleteArtist(artist *domain.Artist) error {
	if artist.Id == 0 {
		return errors.New("cannot delete artist: id not provided")
	}
	return interactor.ArtistRepository.Delete(artist)
}

// ArtistExists checks if an artist exists or not.
func (interactor *LibraryInteractor) ArtistExists(artistId int) bool {
	return interactor.ArtistRepository.Exists(artistId)
}

// ArtistsCount returns the number of artists in the library.
func (interactor *LibraryInteractor) ArtistsCount() (int, error) {
	return interactor.ArtistRepository.Count()
}

// GetAlbum gets an album from its id.
// If no album found, returns an error.
func (interactor *LibraryInteractor) GetAlbum(albumId int, hydrate bool) (domain.Album, error) {
	return interactor.AlbumRepository.Get(albumId, hydrate)
}

// GetAllAlbums gets all albums.
// If no albums found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllAlbums(hydrate bool) ([]domain.Album, error) {
	return interactor.AlbumRepository.GetAll(hydrate)
}

// GetAlbumsForArtist get all albums for a given artist.
// If hydrate == true, the albums tracks will be populated.
// If the artist doesn't exist, return an error.
func (interactor *LibraryInteractor) GetAlbumsForArtist(artistId int, hydrate bool) ([]domain.Album, error) {
	if !interactor.ArtistExists(artistId) {
		return []domain.Album{}, errors.New("cannot get albums: invalid artist ID")
	}
	return interactor.AlbumRepository.GetAlbumsForArtist(artistId, hydrate)
}

// SaveAlbum saves an album.
// An album cannot be saved without a title or if the related artist, if any, doesn't exist.
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

// DeleteAlbum deletes an album.
// Returns an error if no albumId provided.
func (interactor *LibraryInteractor) DeleteAlbum(album *domain.Album) error {
	if album.Id == 0 {
		return errors.New("cannot delete album: id not provided")
	}

	return interactor.AlbumRepository.Delete(album)
}

// AlbumExists checks if an album exists or not.
func (interactor *LibraryInteractor) AlbumExists(albumId int) bool {
	return interactor.AlbumRepository.Exists(albumId)
}

// AlbumsCount returns the number of albums in the library.
func (interactor *LibraryInteractor) AlbumsCount() (int, error) {
	return interactor.AlbumRepository.Count()
}

// GetTrack gets a track from its id.
// If no track found, returns an error.
func (interactor *LibraryInteractor) GetTrack(trackId int) (domain.Track, error) {
	return interactor.TrackRepository.Get(trackId)
}

// GetAllTracks gets all tracks.
// If no tracks found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllTracks() ([]domain.Track, error) {
	return interactor.TrackRepository.GetAll()
}

// GetTracksForAlbum gets all tracks for a given album.
//
// If the album doesn't exists, return an error
func (interactor *LibraryInteractor) GetTracksForAlbum(albumId int) ([]domain.Track, error) {
	if !interactor.AlbumExists(albumId) {
		return []domain.Track{}, errors.New("cannot get tracks: invalid album ID")
	}

	return interactor.TrackRepository.GetTracksForAlbum(albumId)
}

// SaveTrack saves a track.
// A track cannot be saved without a title or if the related artist or album, if any, doesn't exist.
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
		if _, err := interactor.GetArtist(track.ArtistId, false); err != nil {
			invalid = true
			message = "cannot save track: invalid artist ID"
		}
	}
	if track.AlbumId != 0 {
		if _, err := interactor.GetAlbum(track.AlbumId, false); err != nil {
			invalid = true
			message = "cannot save track: invalid album ID"
		}
	}

	if invalid {
		return errors.New(message)
	}

	return interactor.TrackRepository.Save(track)
}

// DeleteTrack deletes a track.
// Returns an error if no trackId provided.
func (interactor *LibraryInteractor) DeleteTrack(track *domain.Track) error {
	if track.Id == 0 {
		return errors.New("cannot delete track: id not provided")
	}

	return interactor.TrackRepository.Delete(track)
}

// TrackExists checks if a track exists or not.
func (interactor *LibraryInteractor) TrackExists(trackId int) bool {
	return interactor.TrackRepository.Exists(trackId)
}

// TracksCount returns the number of tracks in the library.
func (interactor *LibraryInteractor) TracksCount() (int, error) {
	return interactor.TrackRepository.Count()
}

// SaveCover saves a cover.
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

// DeleteCover deletes a cover.
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

// CoverExists checks if a cover exists or not.
func (interactor *LibraryInteractor) CoverExists(coverId int) bool {
	return interactor.CoverRepository.Exists(coverId)
}

// CoverHashExists checks if a cover exists or not by hash.
// Returns cover.Id if exists, else 0.
func (interactor *LibraryInteractor) CoverHashExists(hash string) int {
	return interactor.CoverRepository.ExistsByHash(hash)
}

// GetCollection gets a collection from its id.
// If no collection found, returns an error.
func (interactor *LibraryInteractor) GetCollection(collectionId int) (domain.Collection, error) {
	return interactor.CollectionRepository.Get(collectionId)
}

// GetAllCollections gets all collections for a given type.
// If no tracks found, returns an empty collection.
func (interactor *LibraryInteractor) GetAllCollections(collectionType string, userId int) ([]domain.Collection, error) {
	return interactor.CollectionRepository.GetAll(collectionType, userId)
}

// SaveCollection saves a collection.
func (interactor *LibraryInteractor) SaveCollection(collection *domain.Collection) error {
	invalid := false
	var message string
	if collection.Title == "" {
		invalid = true
		message = "cannot save collection: empty title"
	}
	if collection.Type == "" {
		invalid = true
		message = "cannot save collection: no type provided"
	}
	if collection.Type == "" {
		invalid = true
		message = "cannot save collection: no user id provided"
	}

	if invalid {
		return errors.New(message)
	}

	return interactor.CollectionRepository.Save(collection)
}

// DeleteCollection deletes a collection.
// Returns an error if no collectionId provided.
func (interactor *LibraryInteractor) DeleteCollection(collection *domain.Collection) error {
	if collection.Id == 0 {
		return errors.New("cannot delete collection: id not provided")
	}

	return interactor.CollectionRepository.Delete(collection)
}

// CollectionExists checks if a collection exists or not.
func (interactor *LibraryInteractor) CollectionExists(collectionId int) bool {
	return interactor.CollectionRepository.Exists(collectionId)
}

// UpdateLibrary populates and update the library.
func (interactor *LibraryInteractor) UpdateLibrary() {
	interactor.mutex.Lock()
	interactor.LibraryIsUpdating = true

	_ = interactor.CreateCompilationArtist()
	_, _, _ = interactor.MediaFileRepository.ScanMediaFiles(viper.GetString("Library.Path"))
	interactor.CleanUpLibrary()

	// Log the last time a scan occurred.
	var lastUpdated = InternalVariable{
		Key:   "library_last_updated",
		Value: time.Now().Format("20060102150405"),
	}
	err := interactor.InternalVariableRepository.Save(&lastUpdated)
	if err != nil {
		fmt.Errorf("Error saving library last updated time: %s", err.Error())
	}

	interactor.LibraryIsUpdating = false
	interactor.mutex.Unlock()
}

// EraseLibrary removes all data from library.
func (interactor *LibraryInteractor) EraseLibrary() {
	interactor.mutex.Lock()
	interactor.LibraryIsUpdating = true

	interactor.LibraryRepository.Erase()
	_ = interactor.MediaFileRepository.DeleteCovers()

	interactor.LibraryIsUpdating = false
	interactor.mutex.Unlock()
}

// CleanUpLibrary removes all dead files from library.
// Also removes unused albums and artists.
func (interactor *LibraryInteractor) CleanUpLibrary() {
	tracks, err := interactor.GetAllTracks()
	if err == nil {
		// Delete non-existent tracks.
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

// CreateCompilationArtist creates a common artist for compilations.
func (interactor *LibraryInteractor) CreateCompilationArtist() error {
	_, err := interactor.GetArtistByName(LibraryDefaultCompilationArtist)
	if err != nil {
		compilationArtist := domain.Artist{Name: LibraryDefaultCompilationArtist}
		return interactor.SaveArtist(&compilationArtist)
	}

	return err
}
