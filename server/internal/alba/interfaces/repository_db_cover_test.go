package interfaces

import (
	"testing"
	"github.com/stretchr/testify/suite"
	"github.com/stretchr/testify/assert"
	"log"
	"github.com/humbkr/albaplayer/internal/alba/domain"
)

type CoverRepoTestSuite struct {
	suite.Suite
	CoverRepository CoverDbRepository
}

/**
Go testing framework entry point.
 */
func TestCoverRepoTestSuite(t *testing.T) {
	suite.Run(t, new(CoverRepoTestSuite))
}

func (suite *CoverRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.CoverRepository = CoverDbRepository{AppContext: &appContext}
}

func (suite *CoverRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.CoverRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *CoverRepoTestSuite) SetupTest() {
	resetTestDataSource(suite.CoverRepository.AppContext.DB)
}

func (suite *CoverRepoTestSuite) TestGet() {
	// Test cover retrieval.
	cover, err := suite.CoverRepository.Get(1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, cover.Id)
	assert.Equal(suite.T(), "/fake/path/to/88affd1fe3b0f3624550b36963b76f65.jpg", cover.Path)
	assert.Equal(suite.T(), "88affd1fe3b0f3624550b36963b76f65", cover.Hash)

	// Test to get a non existing artist.
	cover, err = suite.CoverRepository.Get(99)
	assert.NotNil(suite.T(), err)
}

func (suite *CoverRepoTestSuite) TestSave() {
	// Test to save a new cover.
	newCover := &domain.Cover{
		Path: "/fake/path/to/11affd1fe3b0f3624550b36963b76f11.jpg",
		Hash: "11affd1fe3b0f3624550b36963b76f11",
	}

	err := suite.CoverRepository.Save(newCover)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newCover.Id)

	insertedNewCover, errInsert := suite.CoverRepository.Get(newCover.Id)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newCover.Id, insertedNewCover.Id)
	assert.Equal(suite.T(), "/fake/path/to/11affd1fe3b0f3624550b36963b76f11.jpg", insertedNewCover.Path)
	assert.Equal(suite.T(), "11affd1fe3b0f3624550b36963b76f11", insertedNewCover.Hash)

	// Test to update the cover.
	insertedNewCover.Path = "/fake/path/to/22affd1fe3b0f3624550b36963b76f22.jpg"
	insertedNewCover.Hash = "22affd1fe3b0f3624550b36963b76f22"
	errUpdate := suite.CoverRepository.Save(&insertedNewCover)
	assert.Nil(suite.T(), errUpdate)
	assert.Equal(suite.T(), newCover.Id, insertedNewCover.Id)

	updatedCover, errGetMod := suite.CoverRepository.Get(newCover.Id)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newCover.Id, updatedCover.Id)
	assert.Equal(suite.T(), "/fake/path/to/22affd1fe3b0f3624550b36963b76f22.jpg", updatedCover.Path)
	assert.Equal(suite.T(), "22affd1fe3b0f3624550b36963b76f22", updatedCover.Hash)

	// Test to insert a new cover with a prepopulated Id (= update a non existant cover).
	// Note: it seems gorp.Dbmap.Update() fails silently.
	newCoverWithId := &domain.Cover{
		Id: 55,
		Path: "/fake/path/to/33affd1fe3b0f3624550b36963b76f33.jpg",
		Hash: "33affd1fe3b0f3624550b36963b76f33",
	}

	errBogusId := suite.CoverRepository.Save(newCoverWithId)
	assert.Nil(suite.T(), errBogusId)
 }

func (suite *CoverRepoTestSuite) TestDelete() {
	var coverId = 1

	// Get cover to delete.
	cover, err := suite.CoverRepository.Get(coverId)
	assert.Nil(suite.T(), err)

	// Delete cover.
	err = suite.CoverRepository.Delete(&cover)
	assert.Nil(suite.T(), err)

	// Check cover has been removed from the database.
	_, err = suite.CoverRepository.Get(coverId)
	assert.NotNil(suite.T(), err)
}

func (suite *CoverRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.CoverRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non existing data.
	exists = suite.CoverRepository.Exists(543)
	assert.False(suite.T(), exists)
}

func (suite *CoverRepoTestSuite) TestExistsByHash() {
	// Test with existing data.
	coverId := suite.CoverRepository.ExistsByHash("88affd1fe3b0f3624550b36963b76f65")
	assert.Equal(suite.T(), 1, coverId)

	// Test with non existing data.
	coverId = suite.CoverRepository.ExistsByHash("00000d1fe3b0f3624550b36963b76f65")
	assert.Equal(suite.T(), 0, coverId)
}
