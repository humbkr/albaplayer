package interfaces

import (
	"github.com/humbkr/albaplayer/internal/alba/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type AlbumRepoTestSuite struct {
	suite.Suite
	AlbumRepository AlbumDbRepository
}

// Go testing framework entry point.
func TestAlbumRepoTestSuite(t *testing.T) {
	suite.Run(t, new(AlbumRepoTestSuite))
}

func (suite *AlbumRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.AlbumRepository = AlbumDbRepository{AppContext: &appContext}
}

func (suite *AlbumRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.AlbumRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *AlbumRepoTestSuite) SetupTest() {
	resetTestDataSource(suite.AlbumRepository.AppContext.DB)
}

func (suite *AlbumRepoTestSuite) TestGet() {
	// Test album retrieval.
	album, err := suite.AlbumRepository.Get(1, false)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, album.Id)
	assert.Equal(suite.T(), 2, album.ArtistId)
	assert.Equal(suite.T(), "Ænima", album.Title)
	assert.Equal(suite.T(), "1996", album.Year)
	assert.Empty(suite.T(), album.Tracks)

	// Test hydrated album retrieval.
	album, err = suite.AlbumRepository.Get(1, true)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, album.Id)
	assert.Equal(suite.T(), 2, album.ArtistId)
	assert.Equal(suite.T(), "Ænima", album.Title)
	assert.Equal(suite.T(), "1996", album.Year)
	assert.NotEmpty(suite.T(), album.Tracks)
	assert.Len(suite.T(), album.Tracks, 15)

	// Test to get a non-existing album.
	album, err = suite.AlbumRepository.Get(99, false)
	assert.NotNil(suite.T(), err)
}

func (suite *AlbumRepoTestSuite) TestGetAll() {
	// Test to get albums without tracks.
	albums, err := suite.AlbumRepository.GetAll(false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	assert.Equal(suite.T(), 2, len(albums))
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.Empty(suite.T(), album.Tracks)
	}

	// Test to get albums with tracks.
	albums, err = suite.AlbumRepository.GetAll(true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	assert.Equal(suite.T(), 2, len(albums))
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.NotEmpty(suite.T(), album.Tracks)
	}
}

func (suite *AlbumRepoTestSuite) TestGetMultiple() {
	// Test to get albums without tracks.
	albums, err := suite.AlbumRepository.GetMultiple([]int{1, 2}, false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	assert.Equal(suite.T(), 2, len(albums))
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.Empty(suite.T(), album.Tracks)
	}

	// Test to get albums with tracks.
	albums, err = suite.AlbumRepository.GetMultiple([]int{1}, true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	assert.Equal(suite.T(), 1, len(albums))
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.NotEmpty(suite.T(), album.Tracks)
	}
}

func (suite *AlbumRepoTestSuite) TestGetByName() {
	// Test album retrieval.
	album, err := suite.AlbumRepository.GetByName("Ænima", 2)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, album.Id)
	assert.Equal(suite.T(), 2, album.ArtistId)
	assert.Equal(suite.T(), "Ænima", album.Title)
	assert.Equal(suite.T(), "1996", album.Year)
	assert.Empty(suite.T(), album.Tracks)

	// Test to get an album with non-existent name.
	_, err = suite.AlbumRepository.GetByName("Bogus", 2)
	assert.NotNil(suite.T(), err)

	// Test to get an album with wrong artist id.
	_, err = suite.AlbumRepository.GetByName("Ænima", 3)
	assert.NotNil(suite.T(), err)
}

func (suite *AlbumRepoTestSuite) TestGetAlbumsForArtist() {
	// Test to get albums without tracks.
	albums, err := suite.AlbumRepository.GetAlbumsForArtist(2, false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.Equal(suite.T(), 2, album.ArtistId)
		assert.NotEmpty(suite.T(), album.Title)
		assert.Empty(suite.T(), album.Tracks)
	}

	// Test to get albums with tracks.
	albums, err = suite.AlbumRepository.GetAlbumsForArtist(3, true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.Equal(suite.T(), 3, album.ArtistId)
		assert.NotEmpty(suite.T(), album.Title)
		assert.NotEmpty(suite.T(), album.Tracks)

		for _, track := range album.Tracks {
			assert.NotEmpty(suite.T(), track.Id)
			assert.Equal(suite.T(), album.Id, track.AlbumId)
			assert.Equal(suite.T(), album.ArtistId, track.ArtistId)
			assert.NotEmpty(suite.T(), track.Title)
		}
	}
}

func (suite *AlbumRepoTestSuite) TestSave() {
	// Note: we do not save embedded objects for the time being.
	// Test to save a new album.
	newAlbum := &domain.Album{
		ArtistId: 2,
		Title:    "Insert new album test",
		Year:     "2017",
	}

	err := suite.AlbumRepository.Save(newAlbum)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newAlbum.Id)

	insertedNewAlbum, errInsert := suite.AlbumRepository.Get(newAlbum.Id, false)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newAlbum.Id, insertedNewAlbum.Id)
	assert.Equal(suite.T(), 2, insertedNewAlbum.ArtistId)
	assert.Equal(suite.T(), "Insert new album test", insertedNewAlbum.Title)
	assert.Equal(suite.T(), "2017", insertedNewAlbum.Year)
	assert.Empty(suite.T(), insertedNewAlbum.Tracks)

	// Test to update the album.
	insertedNewAlbum.Title = "Update album test"
	insertedNewAlbum.Year = "1988"
	insertedNewAlbum.ArtistId = 2
	errUpdate := suite.AlbumRepository.Save(&insertedNewAlbum)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), insertedNewAlbum.Id)

	updatedAlbum, errGetMod := suite.AlbumRepository.Get(newAlbum.Id, false)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newAlbum.Id, updatedAlbum.Id)
	assert.Equal(suite.T(), 2, updatedAlbum.ArtistId)
	assert.Equal(suite.T(), "Update album test", updatedAlbum.Title)
	assert.Equal(suite.T(), "1988", updatedAlbum.Year)
	assert.Empty(suite.T(), updatedAlbum.Tracks)

	// Test to insert a new album with a pre-populated albumId (= update a non existent album).
	// Note: it seems gorp.Dbmap.Update() fails silently.
	newAlbumWithId := &domain.Album{
		Id:    44,
		Title: "New album bogus id",
		Year:  "2017",
	}

	errBogusId := suite.AlbumRepository.Save(newAlbumWithId)
	assert.Nil(suite.T(), errBogusId)
}

func (suite *AlbumRepoTestSuite) TestDelete() {
	trackRepo := TrackDbRepository{AppContext: suite.AlbumRepository.AppContext}
	var albumId = 1

	// Get album to delete.
	album, err := suite.AlbumRepository.Get(albumId, false)
	assert.Nil(suite.T(), err)

	// Delete album.
	err = suite.AlbumRepository.Delete(&album)
	assert.Nil(suite.T(), err)

	// Check album has been removed from the database.
	_, err = suite.AlbumRepository.Get(albumId, false)
	assert.NotNil(suite.T(), err)

	// Check album tracks have been removed too.
	tracks, err := trackRepo.GetTracksForAlbum(albumId)
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), tracks)

	// Test with an album object where tracks are not populated.
	albumId = 2

	// Get album to delete.
	albumNoTracks, err := suite.AlbumRepository.Get(albumId, true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albumNoTracks.Tracks)

	// Remove tracks from object.
	albumNoTracks.Tracks = []domain.Track{}
	assert.Empty(suite.T(), albumNoTracks.Tracks)

	// Delete album.
	err = suite.AlbumRepository.Delete(&albumNoTracks)
	assert.Nil(suite.T(), err)

	// Check album has been removed from the database.
	_, err = suite.AlbumRepository.Get(albumId, false)
	assert.NotNil(suite.T(), err)

	// Check album tracks have been removed too.
	tracks, err = trackRepo.GetTracksForAlbum(albumId)
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), tracks)
}

func (suite *AlbumRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.AlbumRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non-existing data.
	exists = suite.AlbumRepository.Exists(543)
	assert.False(suite.T(), exists)
}

func (suite *AlbumRepoTestSuite) TestCleanUp() {
	album := domain.Album{
		Title: "Album without tracks",
	}
	err := suite.AlbumRepository.Save(&album)
	assert.Nil(suite.T(), err)

	nonExistentAlbum := domain.Album{}
	errGet := suite.AlbumRepository.AppContext.DB.SelectOne(&nonExistentAlbum, "SELECT * FROM albums WHERE title = ?", album.Title)
	assert.Nil(suite.T(), errGet)

	errCleanUp := suite.AlbumRepository.CleanUp()
	assert.Nil(suite.T(), errCleanUp)

	errGet = suite.AlbumRepository.AppContext.DB.SelectOne(&nonExistentAlbum, "SELECT * FROM albums WHERE title = ?", album.Title)
	assert.NotNil(suite.T(), errGet)
}

func (suite *AlbumRepoTestSuite) TestCount() {
	count, err := suite.AlbumRepository.Count()
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 2, count)
}
