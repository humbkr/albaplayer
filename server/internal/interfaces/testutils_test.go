package interfaces

import (
	"database/sql"
	"encoding/csv"
	"errors"
	"fmt"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/humbkr/albaplayer/internal/utils"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/mock"
	"io"
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"
)

/*
 * Common stuff for repositories tests.
 */

const TestDataDir = "../../testdata/"
const TestDatasourceFile = "test.db"
const TestArtistsFile = TestDataDir + "artists.csv"
const TestAlbumsFile = TestDataDir + "albums.csv"
const TestTracksFile = TestDataDir + "tracks.csv"
const TestCoversFile = TestDataDir + "covers.csv"
const TestUsersFile = TestDataDir + "users.csv"
const TestCollectionsFile = TestDataDir + "collections.csv"
const TestFSLibDir = TestDataDir + "mp3"
const TestFSEmptyLibDir = TestDataDir + "empty_library"

// Initialises the application test datasource.
func createTestDatasource() (ds *sql.DB, err error) {
	tempDir := utils.GetOSTempDir()
	log.Println("Create test db: " + tempDir + TestDatasourceFile)
	return InitAlbaDatasource("sqlite3", tempDir+TestDatasourceFile)
}

func clearTestDataSource(ds *sql.DB) error {
	_, err := ds.Exec("DELETE FROM covers")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'covers'")
	_, err = ds.Exec("DELETE FROM tracks")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'tracks'")
	_, err = ds.Exec("DELETE FROM albums")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'albums'")
	_, err = ds.Exec("DELETE FROM artists")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'artists'")
	_, err = ds.Exec("DELETE FROM variables")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'variables'")
	_, err = ds.Exec("DELETE FROM users_roles")
	_, err = ds.Exec("DELETE FROM users")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'users'")
	_, err = ds.Exec("DELETE FROM users_roles")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'users_roles'")
	_, err = ds.Exec("DELETE FROM collections")
	_, err = ds.Exec("DELETE FROM sqlite_sequence WHERE name = 'collections'")

	return err
}
func resetTestDataSource(ds *sql.DB) error {
	err := clearTestDataSource(ds)
	err = initTestDataSource(ds)

	return err
}

func closeTestDataSource(ds *sql.DB) error {
	err := ds.Close()
	if err != nil {
		return err
	}
	return os.Remove(utils.GetOSTempDir() + TestDatasourceFile)
}

// Populate the database with test data from csv.
func initTestDataSource(ds *sql.DB) (err error) {
	// Artists.
	ds.Exec("INSERT INTO artists(id, name, created_at) VALUES(?, ?, ?)", 1, business.LibraryDefaultCompilationArtist, time.Now().Unix())

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
		ds.Exec("INSERT INTO artists(id, name, created_at) VALUES(?, ?, ?)", record[0], record[1], time.Now().Unix())
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
		ds.Exec(
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
		ds.Exec(
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
		ds.Exec("INSERT INTO covers(id, path, hash) VALUES(?, ?, ?)", record[0], record[1], record[2])
	}
	file.Close()

	// Variables
	ds.Exec("INSERT INTO variables(key, value) VALUES('var_key', 'var_value')")

	// Users.
	file, errOpen = os.OpenFile(TestUsersFile, os.O_RDONLY, 0666)
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
		ds.Exec("INSERT INTO users(id, name, email, password, config, created_at) VALUES(?, ?, ?, ?, ?, ?)", record[0], record[1], record[2], record[3], record[4], record[5])
	}
	file.Close()

	// Users <> Roles
	ds.Exec("INSERT INTO users_roles(user_id, role_name) VALUES(1, 'owner')")
	ds.Exec("INSERT INTO users_roles(user_id, role_name) VALUES(2, 'admin')")
	ds.Exec("INSERT INTO users_roles(user_id, role_name) VALUES(3, 'listener')")

	// Collections.
	file, errOpen = os.OpenFile(TestCollectionsFile, os.O_RDONLY, 0666)
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
		ds.Exec("INSERT INTO collections(id, user_id, type, title, items, created_at) VALUES(?, ?, ?, ?, ?, ?)", record[0], record[1], record[2], record[3], record[4], record[5])
	}
	file.Close()

	return nil
}

/*
 * Mock for artist repository.
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
