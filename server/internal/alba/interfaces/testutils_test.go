package interfaces

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"

	"github.com/go-gorp/gorp"
	"github.com/humbkr/albaplayer/internal/alba/business"
	"github.com/humbkr/albaplayer/internal/alba/domain"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/mock"
)

/*
@file
Common stuff for repositories tests.
*/

const TestDataDir = "../../../testdata/"
const TestDatasourceFile = "test.db"
const TestArtistsFile = TestDataDir + "artists.csv"
const TestAlbumsFile = TestDataDir + "albums.csv"
const TestTracksFile = TestDataDir + "tracks.csv"
const TestCoversFile = TestDataDir + "covers.csv"
const TestFSLibDir = TestDataDir + "mp3"
const TestFSEmptyLibDir = TestDataDir + "empty_library"

// Initialises the application test datasource.
func createTestDatasource() (ds Datasource, err error) {
	return InitAlbaDatasource("sqlite3", os.TempDir()+TestDatasourceFile)
}

func clearTestDataSource(ds Datasource) error {
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		dbmap.Exec("DELETE FROM covers")
		dbmap.Exec("DELETE FROM sqlite_sequence WHERE name = 'covers'")
		dbmap.Exec("DELETE FROM tracks")
		dbmap.Exec("DELETE FROM sqlite_sequence WHERE name = 'tracks'")
		dbmap.Exec("DELETE FROM albums")
		dbmap.Exec("DELETE FROM sqlite_sequence WHERE name = 'albums'")
		dbmap.Exec("DELETE FROM artists")
		dbmap.Exec("DELETE FROM sqlite_sequence WHERE name = 'artists'")
		dbmap.Exec("DELETE FROM variables")
		dbmap.Exec("DELETE FROM sqlite_sequence WHERE name = 'variables'")
	}

	return nil
}
func resetTestDataSource(ds Datasource) error {
	err := clearTestDataSource(ds)
	err = initTestDataSource(ds)

	return err
}

func closeTestDataSource(ds Datasource) error {
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		dbmap.Db.Close()

		return os.Remove(os.TempDir() + TestDatasourceFile)
	}
	return nil
}

// Populate the database with test data from csv.
func initTestDataSource(ds Datasource) (err error) {
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		// Artists.
		dbmap.Exec("INSERT INTO artists(id, name, created_at) VALUES(?, ?, ?)", 1, business.LibraryDefaultCompilationArtist, time.Now().Unix())

		file, errOpen := os.OpenFile(TestArtistsFile, os.O_RDONLY, 0666)
		if errOpen != nil {
			fmt.Println(errOpen)
		}

		r := csv.NewReader(file)
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}

			// Insert the row in database.
			dbmap.Exec("INSERT INTO artists(id, name, created_at) VALUES(?, ?, ?)", record[0], record[1], time.Now().Unix())
		}
		file.Close()

		// Albums.
		file, errOpen = os.OpenFile(TestAlbumsFile, os.O_RDONLY, 0666)
		if errOpen != nil {
			fmt.Println(errOpen)
		}

		r = csv.NewReader(file)
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}

			// Insert the row in database.
			dbmap.Exec(
				"INSERT INTO albums(id, artist_id, title, year, cover_id, created_at) VALUES(?, ?, ?, ?, ?, ?)",
				record[0],
				record[1],
				record[2],
				record[3],
				record[4],
				time.Now().Unix(),
			)
		}
		file.Close()

		// Tracks.
		file, errOpen = os.OpenFile(TestTracksFile, os.O_RDONLY, 0666)
		if errOpen != nil {
			fmt.Println(errOpen)
		}

		r = csv.NewReader(file)
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}

			// Insert the row in database.
			dbmap.Exec(
				"INSERT INTO tracks(id, album_id, artist_id, cover_id, title, disc, number, duration, genre, path, created_at) VALUES(?, ?, ?, ?, ? ,? ,?, ?, ?, ?, ?)",
				record[0],
				record[1],
				record[2],
				record[3],
				record[4],
				record[5],
				record[6],
				record[7],
				record[8],
				record[9],
				time.Now().Unix(),
			)
		}
		file.Close()

		// Covers.
		file, errOpen = os.OpenFile(TestCoversFile, os.O_RDONLY, 0666)
		if errOpen != nil {
			fmt.Println(errOpen)
		}

		r = csv.NewReader(file)
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}

			// Insert the row in database.
			dbmap.Exec("INSERT INTO covers(id, path, hash) VALUES(?, ?, ?)", record[0], record[1], record[2])
		}
		file.Close()

		// Variables
		dbmap.Exec("INSERT INTO variables(key, value) VALUES('var_key', 'var_value')")
	}

	return nil
}

func createMockLibraryInteractor() *business.LibraryInteractor {
	interactor := new(business.LibraryInteractor)
	interactor.ArtistRepository = new(artistRepositoryMock)
	interactor.AlbumRepository = new(albumRepositoryMock)
	interactor.TrackRepository = new(trackRepositoryMock)
	interactor.CoverRepository = new(coverRepositoryMock)
	interactor.MediaFileRepository = new(mediaRepositoryMock)
	interactor.InternalVariableRepository = new(InternalVariableRepositoryMock)

	return interactor
}

/*
Mock for artist repository.
*/

type artistRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *artistRepositoryMock) Get(id int, hydrate bool) (entity domain.Artist, err error) { return }
func (m *artistRepositoryMock) GetAll(hydrate bool) (entities []domain.Artist, err error)  { return }
func (m *artistRepositoryMock) GetMultiple(ids []int, hydrate bool) (entities []domain.Artist, err error) {
	return
}
func (m *artistRepositoryMock) Delete(entity *domain.Artist) (err error) { return }
func (m *artistRepositoryMock) Exists(id int) bool                       { return true }
func (m *artistRepositoryMock) Count() (count int, err error)            { return 42, nil }
func (m *artistRepositoryMock) CleanUp() error                           { return nil }

// Returns a valid response only for name "Artist #1".
func (m *artistRepositoryMock) GetByName(name string) (entity domain.Artist, err error) {
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
func (m *artistRepositoryMock) Save(entity *domain.Artist) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

/* Mock for album repository. */

type albumRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *albumRepositoryMock) Get(id int, hydrate bool) (entity domain.Album, err error) { return }
func (m *albumRepositoryMock) GetAll(hydrate bool) (entities []domain.Album, err error)  { return }
func (m *albumRepositoryMock) GetMultiple(ids []int, hydrate bool) (entities []domain.Album, err error) {
	return
}
func (m *albumRepositoryMock) GetAlbumsForArtist(artistId int, hydrate bool) (entities []domain.Album, err error) {
	return
}
func (m *albumRepositoryMock) Delete(entity *domain.Album) (err error) { return }
func (m *albumRepositoryMock) Exists(id int) bool                      { return false }
func (m *albumRepositoryMock) Count() (count int, err error)           { return 42, nil }
func (m *albumRepositoryMock) CleanUp() error                          { return nil }

// Returns a valid response for name "Album #1" for artistId 1.
// Returns a valid response for name "Album #2" for empty artistId.
func (m *albumRepositoryMock) GetByName(name string, artistId int) (entity domain.Album, err error) {
	if name == "Album #1" && artistId == 1 {
		entity.Id = 1
		entity.Title = "Album #" + strconv.Itoa(1)
		entity.Year = "2017"

		return
	} else if name == "Album #2" && artistId == 0 {
		entity.Id = 2
		entity.Title = "Album #" + strconv.Itoa(2)
		entity.Year = "2017"

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Never fails.
func (m *albumRepositoryMock) Save(entity *domain.Album) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

/* Mock for track repository. */

type trackRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *trackRepositoryMock) Get(id int) (entity domain.Track, err error)                { return }
func (m *trackRepositoryMock) GetAll() (entities []domain.Track, err error)               { return }
func (m *trackRepositoryMock) GetMultiple(ids []int) (entities []domain.Track, err error) { return }
func (m *trackRepositoryMock) GetTracksForAlbum(albumId int) (entities []domain.Track, err error) {
	return
}
func (m *trackRepositoryMock) Delete(entity *domain.Track) (err error) { return }
func (m *trackRepositoryMock) Exists(id int) bool                      { return false }
func (m *trackRepositoryMock) Count() (count int, err error)           { return 42, nil }

// Returns a valid response for name "Track #1" for albumId 1 and artistId 1
// Returns a valid response for name "Track #2" for albumId 1 and empty artistId.
// Returns a valid response for name "Track #3" for empty albumId and empty artistId.
func (m *trackRepositoryMock) GetByName(name string, artistId int, albumId int) (entity domain.Track, err error) {
	if name == "Track #1" && artistId == 1 && albumId == 1 {
		entity.Id = 1
		entity.Title = "Track #" + strconv.Itoa(1)
		entity.Path = fmt.Sprintf("/music/Track %v.mp3", 1)

		return
	} else if name == "Track #2" && artistId == 0 && albumId == 1 {
		entity.Id = 1
		entity.Title = "Track #" + strconv.Itoa(2)
		entity.Path = fmt.Sprintf("/music/Track %v.mp3", 2)

		return
	} else if name == "Track #3" && artistId == 0 && albumId == 0 {
		entity.Id = 1
		entity.Title = "Track #" + strconv.Itoa(3)
		entity.Path = fmt.Sprintf("/music/Track %v.mp3", 3)

		return
	}

	// Else return an error.
	err = errors.New("not found")
	return
}

// Never fails.
func (m *trackRepositoryMock) Save(entity *domain.Track) (err error) {
	if entity.Id != 0 {
		// This is an update, do nothing.
		return
	}

	// Else this is a new entity, fill the Id.
	entity.Id = rand.Intn(50)
	return
}

/*
Mock for cover repository.
*/

type coverRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *coverRepositoryMock) Get(id int) (entity domain.Cover, err error) { return }
func (m *coverRepositoryMock) Save(entity *domain.Cover) (err error)       { return }
func (m *coverRepositoryMock) Delete(entity *domain.Cover) (err error)     { return }
func (m *coverRepositoryMock) Exists(id int) bool                          { return true }
func (m *coverRepositoryMock) ExistsByHash(hash string) int                { return 1 }

/*
Mock for cover repository.
*/

type mediaRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *mediaRepositoryMock) ScanMediaFiles(path string) (int, int, error)               { return 0, 0, nil }
func (m *mediaRepositoryMock) MediaFileExists(filepath string) bool                       { return true }
func (m *mediaRepositoryMock) WriteCoverFile(file *domain.Cover, directory string) error  { return nil }
func (m *mediaRepositoryMock) RemoveCoverFile(file *domain.Cover, directory string) error { return nil }
func (m *mediaRepositoryMock) DeleteCovers() error                                        { return nil }

/*
Mock for internal variable repository.
*/

type InternalVariableRepositoryMock struct {
	mock.Mock
}

// Not needed.
func (m *InternalVariableRepositoryMock) Get(key string) (variable business.InternalVariable, err error) {
	return
}
func (m *InternalVariableRepositoryMock) Save(variable *business.InternalVariable) (err error) {
	return
}
func (m *InternalVariableRepositoryMock) Delete(variable *business.InternalVariable) (err error) {
	return
}
func (m *InternalVariableRepositoryMock) Exists(key string) bool { return true }
