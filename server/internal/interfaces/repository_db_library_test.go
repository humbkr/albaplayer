package interfaces

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type LibraryRepoTestSuite struct {
	suite.Suite
	LibraryRepository LibraryDbRepository
}

// Go testing framework entry point.
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
	err := resetTestDataSource(suite.LibraryRepository.AppContext.DB)
	if err != nil {
		return
	}
}

func (suite *LibraryRepoTestSuite) TestErase() {
	// Erase library then try to get stuff.
	err := suite.LibraryRepository.Erase()
	assert.Nil(suite.T(), err)

	// Test tables.
	_, err = suite.LibraryRepository.AppContext.DB.Query("SELECT * FROM artists")
	assert.Nil(suite.T(), err)

	_, err = suite.LibraryRepository.AppContext.DB.Query("SELECT * FROM albums")
	assert.Nil(suite.T(), err)

	_, err = suite.LibraryRepository.AppContext.DB.Query("SELECT * FROM tracks")
	assert.Nil(suite.T(), err)

	_, err = suite.LibraryRepository.AppContext.DB.Query("SELECT * FROM covers")
	assert.Nil(suite.T(), err)

	// Test sequences.
	type Sequence struct {
		name string
		seq  int
	}

	var sequences []Sequence
	rows, err := suite.LibraryRepository.AppContext.DB.Query("SELECT * FROM sqlite_sequence")
	assert.Nil(suite.T(), err)

	for rows.Next() {
		var sequence Sequence

		err := rows.Scan(&sequence.name, &sequence.seq)
		assert.Nil(suite.T(), err)
	}

	for _, val := range sequences {
		assert.Equal(suite.T(), 0, val.seq)
	}
}
