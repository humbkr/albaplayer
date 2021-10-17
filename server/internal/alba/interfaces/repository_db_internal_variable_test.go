package interfaces

import (
	"testing"
	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/stretchr/testify/suite"
	"github.com/stretchr/testify/assert"
	"log"
)

type InternalVariableRepoTestSuite struct {
	suite.Suite
	InternalVariableRepository InternalVariableDbRepository
}

/**
Go testing framework entry point.
 */
func TestInternalVariableRepoTestSuite(t *testing.T) {
	suite.Run(t, new(InternalVariableRepoTestSuite))
}

func (suite *InternalVariableRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.InternalVariableRepository = InternalVariableDbRepository{AppContext: &appContext}
}

func (suite *InternalVariableRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.InternalVariableRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *InternalVariableRepoTestSuite) SetupTest() {
	_ = resetTestDataSource(suite.InternalVariableRepository.AppContext.DB)
}

func (suite *InternalVariableRepoTestSuite) TestGet() {
	// Test variable retrieval.
	variable, err := suite.InternalVariableRepository.Get("var_key")
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "var_key", variable.Key)
	assert.Equal(suite.T(), "var_value", variable.Value)

	// Test to get a non existing variable.
	variable, err = suite.InternalVariableRepository.Get("doesnotexist")
	assert.NotNil(suite.T(), err)
}

func (suite *InternalVariableRepoTestSuite) TestSave() {
	// Test to save a new variable.
	newVariable := &business.InternalVariable{
		Key: "var_key_new",
		Value: "var_value_new",
	}

	err := suite.InternalVariableRepository.Save(newVariable)
	assert.Nil(suite.T(), err)

	insertedNewVariable, errInsert := suite.InternalVariableRepository.Get(newVariable.Key)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), "var_key_new", insertedNewVariable.Key)
	assert.Equal(suite.T(), "var_value_new", insertedNewVariable.Value)

	// Test to update the variable value.
	insertedNewVariable.Value = "var_value_mod"
	errUpdate := suite.InternalVariableRepository.Save(&insertedNewVariable)
	assert.Nil(suite.T(), errUpdate)

	updatedVariable, errGetMod := suite.InternalVariableRepository.Get(newVariable.Key)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), "var_value_mod", updatedVariable.Value)

	// Test to set a variable without a key.
	newVariableNoKey := business.InternalVariable{
		Key: "",
		Value: "var_value_new",
	}
	errNoKey := suite.InternalVariableRepository.Save(&newVariableNoKey)
	assert.NotNil(suite.T(), errNoKey)
 }

func (suite *InternalVariableRepoTestSuite) TestDelete() {
	var varKey = "var_key"

	// Get cover to delete.
	variable, err := suite.InternalVariableRepository.Get(varKey)
	assert.Nil(suite.T(), err)

	// Delete cover.
	err = suite.InternalVariableRepository.Delete(&variable)
	assert.Nil(suite.T(), err)

	// Check cover has been removed from the database.
	_, err = suite.InternalVariableRepository.Get(varKey)
	assert.NotNil(suite.T(), err)
}

func (suite *InternalVariableRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.InternalVariableRepository.Exists("var_key")
	assert.True(suite.T(), exists)

	// Test with non existing data.
	exists = suite.InternalVariableRepository.Exists("doesNotExist")
	assert.False(suite.T(), exists)
}
