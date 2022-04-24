package interfaces

import (
	"os"
	"testing"

	"github.com/go-gorp/gorp"
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
	testDataSourceFile := os.TempDir() + "testDataSource.db"

	// Test creating the datasource.
	ds, err := InitAlbaDatasource("sqlite3", testDataSourceFile)
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), ds)

	// Close datasource and remove test file.
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		_ = dbmap.Db.Close()
	}

	// Test with an invalid path.
	// Test creating the datasource.
	ds, err = InitAlbaDatasource("sqlite3", "/whatever/test.db")
	assert.NotNil(suite.T(), err)
	assert.Nil(suite.T(), ds)

	// Close datasource and remove test file.
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		_ = dbmap.Db.Close()
	}

	// Test with an invalid driver.
	// Test creating the datasource.
	ds, err = InitAlbaDatasource("", "/whatever/test.db")
	assert.NotNil(suite.T(), err)
	assert.Nil(suite.T(), ds)

	// Close datasource and remove test file.
	if dbmap, ok := ds.(*gorp.DbMap); ok == true {
		_ = dbmap.Db.Close()
	}
}
