package interfaces

import (
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type CollectionRepoTestSuite struct {
	suite.Suite
	CollectionRepository CollectionDbRepository
}

// Go testing framework entry point.
func TestCollectionRepoTestSuite(t *testing.T) {
	suite.Run(t, new(CollectionRepoTestSuite))
}

func (suite *CollectionRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.CollectionRepository = CollectionDbRepository{AppContext: &appContext}
}

func (suite *CollectionRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.CollectionRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *CollectionRepoTestSuite) SetupTest() {
	err := resetTestDataSource(suite.CollectionRepository.AppContext.DB)
	if err != nil {
		log.Fatal(err)
	}
}

func (suite *CollectionRepoTestSuite) TestGet() {
	// Test collection retrieval.
	item, err := suite.CollectionRepository.Get(1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, item.Id)
	assert.Equal(suite.T(), "tracks", item.Type)
	assert.Equal(suite.T(), "Playlist user 1 - 1", item.Title)
	assert.Equal(suite.T(), "items playlist 1 - 1", item.Items)

	// Test to get a non-existing collection.
	item, err = suite.CollectionRepository.Get(99)
	assert.NotNil(suite.T(), err)
}

func (suite *CollectionRepoTestSuite) TestGetAll() {
	// Test to get collections of type 'tracks'.
	items, err := suite.CollectionRepository.GetAll("tracks", 1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), items)
	assert.Equal(suite.T(), 2, len(items))
	for _, item := range items {
		assert.NotEmpty(suite.T(), item.Id)
		assert.NotEmpty(suite.T(), item.Type)
		assert.NotEmpty(suite.T(), item.Title)
		assert.NotEmpty(suite.T(), item.Items)
	}
}

func (suite *CollectionRepoTestSuite) TestGetMultiple() {
	// Test to get collections.
	items, err := suite.CollectionRepository.GetMultiple([]int{1, 2})
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), items)
	assert.Equal(suite.T(), 2, len(items))
	for _, item := range items {
		assert.NotEmpty(suite.T(), item.Id)
		assert.NotEmpty(suite.T(), item.Type)
		assert.NotEmpty(suite.T(), item.Title)
		assert.NotEmpty(suite.T(), item.Items)
	}
}

func (suite *CollectionRepoTestSuite) TestSave() {
	// Test to save a new collection.
	newItem := &domain.Collection{
		Type:  "tracks",
		Title: "Insert new collection test",
		Items: "a list of items",
	}

	err := suite.CollectionRepository.Save(newItem)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newItem.Id)

	insertedNewItem, errInsert := suite.CollectionRepository.Get(newItem.Id)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newItem.Id, insertedNewItem.Id)
	assert.Equal(suite.T(), "tracks", insertedNewItem.Type)
	assert.Equal(suite.T(), "Insert new collection test", insertedNewItem.Title)
	assert.Equal(suite.T(), "a list of items", insertedNewItem.Items)

	// Test to update the collection.
	insertedNewItem.Type = "albums"
	insertedNewItem.Title = "Update collection test"
	insertedNewItem.Items = "a new list of items"
	errUpdate := suite.CollectionRepository.Save(&insertedNewItem)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), insertedNewItem.Id)

	updatedCollection, errGetMod := suite.CollectionRepository.Get(newItem.Id)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newItem.Id, updatedCollection.Id)
	assert.Equal(suite.T(), "albums", updatedCollection.Type)
	assert.Equal(suite.T(), "Update collection test", updatedCollection.Title)
	assert.Equal(suite.T(), "a new list of items", updatedCollection.Items)

	// Test to insert a new collection with a pre-populated albumId (= update a non existent album).
	// Note: it seems gorp.Dbmap.Update() fails silently.
	newCollectionWithId := &domain.Collection{
		Id:    44,
		Type:  "tracks",
		Title: "New album bogus id",
		Items: "a list of items",
	}

	errBogusId := suite.CollectionRepository.Save(newCollectionWithId)
	assert.Nil(suite.T(), errBogusId)
}

func (suite *CollectionRepoTestSuite) TestDelete() {
	var itemId = 1

	// Get collection to delete.
	item, err := suite.CollectionRepository.Get(itemId)
	assert.Nil(suite.T(), err)

	// Delete collection.
	err = suite.CollectionRepository.Delete(&item)
	assert.Nil(suite.T(), err)

	// Check collection has been removed from the database.
	_, err = suite.CollectionRepository.Get(itemId)
	assert.NotNil(suite.T(), err)
}

func (suite *CollectionRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.CollectionRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non-existing data.
	exists = suite.CollectionRepository.Exists(543)
	assert.False(suite.T(), exists)
}
