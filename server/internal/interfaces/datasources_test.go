package interfaces

import (
	"github.com/humbkr/albaplayer/internal/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type DatasourcesTestSuite struct {
	suite.Suite
}

// Go testing framework entry point.
func TestDatasourcesTestSuite(t *testing.T) {
	suite.Run(t, new(DatasourcesTestSuite))
}

func (suite *DatasourcesTestSuite) TestInitAlbaDatasource() {
	// Rewrite datasource config for test.
	testDataSourceFile := utils.GetOSTempDir() + "testDataSource.db"

	// Test creating the datasource.
	ds, err := InitAlbaDatasource("sqlite3", testDataSourceFile)
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), ds)

	errClose := ds.Close()
	assert.Nil(suite.T(), errClose)

	// Test with an invalid path.
	// Test creating the datasource.
	ds, err = InitAlbaDatasource("sqlite3", "/whatever/test.db")
	assert.NotNil(suite.T(), err)
	assert.Nil(suite.T(), ds)

	// No need to close.
	// ds.Close()

	// Test with an invalid driver.
	// Test creating the datasource.
	ds, err = InitAlbaDatasource("", "/whatever/test.db")
	assert.NotNil(suite.T(), err)
	assert.Nil(suite.T(), ds)

	// No need to close.
	// ds.Close()
}
