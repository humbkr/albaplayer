package business

import (
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
	"github.com/stretchr/testify/mock"
	"errors"
	"strconv"
	"fmt"
	"math/rand"
)

/*
@file
Mock stuff for business tests.
 */

func createMockLibraryInteractor() (*LibraryInteractor) {
	interactor := new(LibraryInteractor)
	interactor.ArtistRepository = new(ArtistRepositoryMock)
	interactor.AlbumRepository = new(AlbumRepositoryMock)
	interactor.TrackRepository = new(TrackRepositoryMock)
	interactor.CoverRepository = new(CoverRepositoryMock)
	interactor.MediaFileRepository = new(MediaFileRepositoryMock)
	interactor.LibraryRepository = new(LibraryRepositoryMock)
	interactor.InternalVariableRepository = new(InternalVariableRepositoryMock)

	return interactor
}

/*
Mock for library repository.
*/
type LibraryRepositoryMock struct{
	mock.Mock
}
func (m LibraryRepositoryMock) Erase() {}

/*
Mock for artist repository.
*/
type ArtistRepositoryMock struct{
	mock.Mock
}

// Returns a valid response for any id inferior or equals to 10, else an error.
func (m *ArtistRepositoryMock) Get(id int) (entity domain.Artist, err error) {
	if id <= 10 {
		// Return a valid artist.
		entity.Id = id
		entity.Name = "Artist #" + strconv.Itoa(id)

		for i := 1; i < 4; i++ {
			album := domain.Album{
				Id: i,
				ArtistId: id,
				Title: fmt.Sprintf("Album #%v for artist #%v", i, id),
				Year: "2017",
				// Tracks will be tested elsewhere.
			}
			entity.Albums = append(entity.Albums, album)
		}

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Returns 3 artists.
func (m *ArtistRepositoryMock) GetAll(hydrate bool) (entities domain.Artists, err error) {
	for i := 1; i < 4; i++ {
		artist := domain.Artist{
			Id: i,
			Name: "Artist #" + strconv.Itoa(i),
		}

		if hydrate {
			for j := 1; j < 4; j++ {
				album := domain.Album{
					Id:       j,
					ArtistId: i,
					Title:    fmt.Sprintf("Album #%v for artist #%v", j, i),
					Year:     "2017",
					// Tracks will be tested in album repo.
				}
				artist.Albums = append(artist.Albums, album)
			}
		}

		entities = append(entities, artist)
	}

	return
}

// Returns a valid respones only for name "Artist #1"
func (m *ArtistRepositoryMock) GetByName(name string) (entity domain.Artist, err error) {
	if name == "Artist #1" {
		entity.Id = 1
		entity.Name = "Artist #1"

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Never fails.
func (m *ArtistRepositoryMock) Save(entity *domain.Artist) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

// Never fails.
func (m *ArtistRepositoryMock) Delete(entity *domain.Artist) (err error) {
	return
}

// Returns true if id == 1, else false.
func (m ArtistRepositoryMock) Exists(id int) bool {
	return id == 1
}

func (m ArtistRepositoryMock) CleanUp() error {return nil}


/* Mock for album repository. */

type AlbumRepositoryMock struct{
	mock.Mock
}

// Returns a valid response for any id inferior or equals to 10, else an error.
func (m *AlbumRepositoryMock) Get(id int) (entity domain.Album, err error) {
	if id <= 10 {
		// Return a valid album.
		entity.Id = id
		entity.Title = "Album #" + strconv.Itoa(id)
		entity.Year = "2017"

		for i := 1; i < 4; i++ {
			track := domain.Track{
				Id: i,
				AlbumId: id,
				Title: fmt.Sprintf("Track #%v for album #%v", i, id),
				Path: fmt.Sprintf("/music/Album %v/Track %v.mp3", id, i),
			}
			entity.Tracks = append(entity.Tracks, track)
		}

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Returns 3 albums.
func (m *AlbumRepositoryMock) GetAll(hydrate bool) (entities domain.Albums, err error) {
	for i := 1; i < 4; i++ {
		album := domain.Album{
			Id:    i,
			Title: "Album #" + strconv.Itoa(i),
			Year:  "2017",
		}

		if hydrate {
			for j := 1; j < 4; j++ {
				track := domain.Track{
					Id: j,
					AlbumId: i,
					Title: fmt.Sprintf("Track #%v for album #%v", j, i),
					Path: fmt.Sprintf("/music/Album %v/Track %v.mp3", i, j),
				}
				album.Tracks = append(album.Tracks, track)
			}
		}

		entities = append(entities, album)
	}

	return
}

// Returns a valid respones only for name "Album #1" for artistId 1.
func (m *AlbumRepositoryMock) GetByName(name string, artistId int) (entity domain.Album, err error) {
	if name == "Album #1" && artistId == 1 {
		entity.Id = 1
		entity.Title = "Album #" + strconv.Itoa(1)
		entity.Year = "2017"

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Returns album for artistId 1, else no albums.
func (m *AlbumRepositoryMock) GetAlbumsForArtist(artistId int, hydrate bool) (entities domain.Albums, err error) {
	if artistId == 1 {
		entities, _ = m.GetAll(hydrate)

		for idx, val := range entities {
			entities[idx].ArtistId = 1

			if hydrate {
				for idxT := range val.Tracks {
					entities[idx].Tracks[idxT].ArtistId = 1
				}
			}
		}
	}

	return
}

// Never fails.
func (m *AlbumRepositoryMock) Save(entity *domain.Album) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

// Never fails.
func (m *AlbumRepositoryMock) Delete(entity *domain.Album) (err error) {
	return
}

// Returns true if id == 1, else false.
func (m AlbumRepositoryMock) Exists(id int) bool {
	return id == 1
}

func (m AlbumRepositoryMock) CleanUp() error {return nil}


/* Mock for track repository. */

type TrackRepositoryMock struct{
	mock.Mock
}

// Returns a valid response for any id inferior or equals to 10, else an error.
func (m *TrackRepositoryMock) Get(id int) (entity domain.Track, err error) {
	if id <= 10 {
		// Return a valid album.
		entity.Id = id
		entity.Title = "Track #" + strconv.Itoa(id)
		entity.Path = fmt.Sprintf("/music/Track %v.mp3", id)

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Returns 3 tracks.
func (m *TrackRepositoryMock) GetAll() (entities domain.Tracks, err error) {
	for i := 1; i < 4; i++ {
		track := domain.Track{
			Id: i,
			Title: "Track #" + strconv.Itoa(i),
			Path: fmt.Sprintf("/music/Track %v.mp3", i),
			AlbumId: i,
			ArtistId: i,
		}

		entities = append(entities, track)
	}

	return
}

// Returns a valid respones only for name "Track #1" for album 1 and artist 1
func (m *TrackRepositoryMock) GetByName(name string, artistId int, albumId int) (entity domain.Track, err error) {
	if name == "Track #1" && artistId == 1 && albumId == 1 {
		entity.Id = 1
		entity.Title = "Track #" + strconv.Itoa(1)
		entity.Path = fmt.Sprintf("/music/Track %v.mp3", 1)

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Returns album for albumId 1, else no albums.
func (m *TrackRepositoryMock) GetTracksForAlbum(albumId int) (entities domain.Tracks, err error) {
	if albumId == 1 {
		entities, _ = m.GetAll()

		for idx := range entities {
			entities[idx].AlbumId = 1
		}
	}

	return
}

// Never fails.
func (m *TrackRepositoryMock) Save(entity *domain.Track) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

// Never fails.
func (m *TrackRepositoryMock) Delete(entity *domain.Track) (err error) {
	return
}

// Returns true if id == 1, else false.
func (m TrackRepositoryMock) Exists(id int) bool {
	return id == 1
}


/*
Mock for cover repository.
*/
type CoverRepositoryMock struct{
	mock.Mock
}

// Returns a valid response for any id inferior or equals to 10, else an error.*/
func (m *CoverRepositoryMock) Get(id int) (entity domain.Cover, err error) {
	if id < 10 {
		entity.Id = id
		entity.Path = "/path/to/cover.jpg"
		entity.Hash = "8f338837a96141e96d663b67e464648e"

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Never fails.
func (m *CoverRepositoryMock) Save(entity *domain.Cover) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}


// Never fails.
func (m *CoverRepositoryMock) Delete(entity *domain.Cover) (err error) {
	return
}

// Returns true if id == 1, else false.
func (m *CoverRepositoryMock) Exists(id int) bool {
	return id == 1
}

// Returns 1 if hash == 8f338837a96141e96d663b67e464648e, else 0.
func (m *CoverRepositoryMock) ExistsByHash(hash string) int {
	if hash == "8f338837a96141e96d663b67e464648e" {
		return 1
	}

	return 0
}

/*
Mock for media file repository.
*/
type MediaFileRepositoryMock struct{
	mock.Mock
}

func (m *MediaFileRepositoryMock) ScanMediaFiles(path string) (int, int, error) { return 0, 0, nil }
func (m *MediaFileRepositoryMock) WriteCoverFile(file *domain.Cover, directory string) error { return nil }
func (m *MediaFileRepositoryMock) RemoveCoverFile(file *domain.Cover, directory string) error { return nil }
func (m *MediaFileRepositoryMock) DeleteCovers() error { return nil }

// Returns false except for paths of the 2 first tracks returned by trackRepoMock getAll().
func (m *MediaFileRepositoryMock) MediaFileExists(filepath string) bool {
	for i := 1; i < 3; i++ {
		if filepath == fmt.Sprintf("/music/Track %v.mp3", i) {
			return true
		}
	}

	return false
}

/*
Mock for internal variable repository.
*/

type InternalVariableRepositoryMock struct{
	mock.Mock
}

// Not needed.
func (m *InternalVariableRepositoryMock) Get(key string) (variable InternalVariable, err error) {return}
func (m *InternalVariableRepositoryMock) Save(variable *InternalVariable) (err error) {return}
func (m *InternalVariableRepositoryMock) Delete(variable *InternalVariable) (err error) {return}
func (m *InternalVariableRepositoryMock) Exists(key string) bool {return true}
