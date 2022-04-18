package interfaces

import (
	"github.com/humbkr/albaplayer/internal/alba/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type LibraryRepoTestSuite struct {
	suite.Suite
	LibraryRepository LibraryDbRepository
}

/**
Go testing framework entry point.
 */
func TestLibraryRepoTestSuite(t *testing.T) {
	suite.Run(t, new(LibraryRepoTestSuite))
}

func (suite *LibraryRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.LibraryRepository = LibraryDbRepository{AppContext: &appContext}
}

func (suite *LibraryRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.LibraryRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *LibraryRepoTestSuite) SetupTest() {
	resetTestDataSource(suite.LibraryRepository.AppContext.DB)
}

func (suite *LibraryRepoTestSuite) TestErase() {
	// Erase library then try to get stuff.
	suite.LibraryRepository.Erase()

	// Test tables.
	var entitiesArtists []domain.Artist
	_, err := suite.LibraryRepository.AppContext.DB.Select(&entitiesArtists, "SELECT * FROM artists")
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), entitiesArtists)

	var entitiesAlbums []domain.Album
	_, err = suite.LibraryRepository.AppContext.DB.Select(&entitiesAlbums, "SELECT * FROM albums")
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), entitiesAlbums)

	var entitiesTracks []domain.Track
	_, err = suite.LibraryRepository.AppContext.DB.Select(&entitiesTracks, "SELECT * FROM tracks")
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), entitiesTracks)

	var entitiesCovers []domain.Cover
	_, err = suite.LibraryRepository.AppContext.DB.Select(&entitiesCovers, "SELECT * FROM covers")
	assert.Nil(suite.T(), err)
	assert.Empty(suite.T(), entitiesCovers)

	// Test sequences.
	type sequence struct {
		name string
		seq int
	}

	var sequences []sequence
	_, err = suite.LibraryRepository.AppContext.DB.Select(&sequences, "SELECT * FROM sqlite_sequence")

	for _, val := range sequences {
		assert.Equal(suite.T(), 0, val.seq)
	}
}
