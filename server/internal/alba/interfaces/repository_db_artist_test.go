package interfaces

import (
	"log"
	"testing"

	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type ArtistRepoTestSuite struct {
	suite.Suite
	ArtistRepository ArtistDbRepository
}

/**
Go testing framework entry point.
 */
func TestArtistRepoTestSuite(t *testing.T) {
	suite.Run(t, new(ArtistRepoTestSuite))
}

func (suite *ArtistRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.ArtistRepository = ArtistDbRepository{AppContext: &appContext}
}

func (suite *ArtistRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.ArtistRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *ArtistRepoTestSuite) SetupTest() {
	resetTestDataSource(suite.ArtistRepository.AppContext.DB)
}

func (suite *ArtistRepoTestSuite) TestGet() {
	// Test artist retrieval.
	artist, err := suite.ArtistRepository.Get(2)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 2, artist.Id)
	assert.Equal(suite.T(), "Tool", artist.Name)
	assert.NotEmpty(suite.T(), artist.Albums)
	assert.Len(suite.T(), artist.Albums, 1)

	// Test to get a non existing artist.
	artist, err = suite.ArtistRepository.Get(99)
	assert.NotNil(suite.T(), err)
}

func (suite *ArtistRepoTestSuite) TestGetAll() {
	// Test to get artist without albums.
	artists, err := suite.ArtistRepository.GetAll(false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artists)
	for _, artist := range artists {
		assert.NotEmpty(suite.T(), artist.Id)
		assert.NotEmpty(suite.T(), artist.Name)
		assert.Empty(suite.T(), artist.Albums)
	}

	// Test to get artist with albums.
	artists, err = suite.ArtistRepository.GetAll(true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artists)
	for _, artist := range artists {
		assert.NotEmpty(suite.T(), artist.Id)
		assert.NotEmpty(suite.T(), artist.Name)

		if artist.Name != business.LibraryDefaultCompilationArtist {
			assert.NotEmpty(suite.T(), artist.Albums)
		}
	}
}

func (suite *ArtistRepoTestSuite) TestGetByName() {
	// Test artist retrieval.
	artist, err := suite.ArtistRepository.GetByName("Tool")
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 2, artist.Id)
	assert.Equal(suite.T(), "Tool", artist.Name)
	assert.Empty(suite.T(), artist.Albums)

	// Test to get an artist with non existant name.
	_, err = suite.ArtistRepository.GetByName("Bogus")
	assert.NotNil(suite.T(), err)
}

func (suite *ArtistRepoTestSuite) TestSave() {
	// Note: we do not save embedded objects for the time being.
	// Test to save a new artist.
	newArtist := &domain.Artist{
		Name: "Insert new artist test",
	}

	err := suite.ArtistRepository.Save(newArtist)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newArtist.Id)

	insertedNewArtist, errInsert := suite.ArtistRepository.Get(newArtist.Id)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newArtist.Id, insertedNewArtist.Id)
	assert.Equal(suite.T(), "Insert new artist test", insertedNewArtist.Name)
	assert.Empty(suite.T(), insertedNewArtist.Albums)

	// Test to update the artist.
	insertedNewArtist.Name = "Update artist test"
	errUpdate := suite.ArtistRepository.Save(&insertedNewArtist)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), insertedNewArtist.Id)

	updatedArtist, errGetMod := suite.ArtistRepository.Get(newArtist.Id)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newArtist.Id, updatedArtist.Id)
	assert.Equal(suite.T(), "Update artist test", updatedArtist.Name)
	assert.Empty(suite.T(), updatedArtist.Albums)

	// Test to insert a new artist with a prepopulated Id (= update a non existant artist).
	// Note: it seems gorp.Dbmap.Update() fails silently.
	newArtistWithId := &domain.Artist{
		Id: 55,
		Name: "New artist bogus id",
	}

	errBogusId := suite.ArtistRepository.Save(newArtistWithId)
	assert.Nil(suite.T(), errBogusId)
 }

func (suite *ArtistRepoTestSuite) TestDelete() {
	albumRepo := AlbumDbRepository{AppContext: suite.ArtistRepository.AppContext}
	var artistId = 1

	//Get artist to delete.
	artist, err := suite.ArtistRepository.Get(artistId)
	assert.Nil(suite.T(), err)

	// Delete artist.
	err = suite.ArtistRepository.Delete(&artist)
	assert.Nil(suite.T(), err)

	// Check artist has been removed from the database.
	_, err = suite.ArtistRepository.Get(artistId)
	assert.NotNil(suite.T(), err)

	// Check artist's albums have been removed too.
	albums, err := albumRepo.GetAlbumsForArtist(artistId, false)
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), albums)

	// Check that tracks have been removed too is already done in albumRepository tests.

	// Test with an artist object where albums are not populated.
	artistId = 2

	// Get album to delete.
	artistNoAlbums, err := suite.ArtistRepository.Get(artistId)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artistNoAlbums.Albums)

	// Remove tracks from object.
	artistNoAlbums.Albums = domain.Albums{}
	assert.Empty(suite.T(), artistNoAlbums.Albums)

	// Delete artist.
	err = suite.ArtistRepository.Delete(&artistNoAlbums)
	assert.Nil(suite.T(), err)

	// Check album has been removed from the database.
	_, err = suite.ArtistRepository.Get(artistId)
	assert.NotNil(suite.T(), err)

	// Check album tracks have been removed too.
	albums, err = albumRepo.GetAlbumsForArtist(artistId, false)
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), albums)

	// Check that tracks have been removed too is already done in albumRepository tests.
}

func (suite *ArtistRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.ArtistRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non existing data.
	exists = suite.ArtistRepository.Exists(543)
	assert.False(suite.T(), exists)
}

func (suite *ArtistRepoTestSuite) TestCleanUp() {
	artist := domain.Artist{
		Name: "Artist without tracks",
	}
	err := suite.ArtistRepository.Save(&artist)
	assert.Nil(suite.T(), err)

	artistWithoutTracks := domain.Artist{}
	errGet := suite.ArtistRepository.AppContext.DB.SelectOne(&artistWithoutTracks, "SELECT * FROM artists WHERE name = ?", artist.Name)
	assert.Nil(suite.T(), errGet)

	variousArtists := domain.Artist{}
	errGetVarious := suite.ArtistRepository.AppContext.DB.SelectOne(&variousArtists, "SELECT * FROM artists WHERE name = ?", business.LibraryDefaultCompilationArtist)
	assert.Nil(suite.T(), errGetVarious)

	errCleanUp := suite.ArtistRepository.CleanUp()
	assert.Nil(suite.T(), errCleanUp)

	// Check orphan artist has been deleted.
	nonExistantArtist := domain.Artist{}
	errGetNonExistant := suite.ArtistRepository.AppContext.DB.SelectOne(&nonExistantArtist, "SELECT * FROM artists WHERE name = ?", artist.Name)
	assert.NotNil(suite.T(), errGetNonExistant)

	// Check Various artists has not been deleted
	variousArtists = domain.Artist{}
	errGetVarious = suite.ArtistRepository.AppContext.DB.SelectOne(&variousArtists, "SELECT * FROM artists WHERE name = ?", business.LibraryDefaultCompilationArtist)
	assert.Nil(suite.T(), errGetVarious)
}
