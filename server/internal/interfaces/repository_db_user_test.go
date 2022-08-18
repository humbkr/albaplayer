package interfaces

import (
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type UserRepoTestSuite struct {
	suite.Suite
	UserRepository UserDbRepository
}

/*
*
Go testing framework entry point.
*/
func TestUserRepoTestSuite(t *testing.T) {
	suite.Run(t, new(UserRepoTestSuite))
}

func (suite *UserRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.UserRepository = UserDbRepository{AppContext: &appContext}
}

func (suite *UserRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.UserRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *UserRepoTestSuite) SetupTest() {
	err := resetTestDataSource(suite.UserRepository.AppContext.DB)
	if err != nil {
		return
	}
}

func (suite *UserRepoTestSuite) TestGet() {
	// Test user retrieval.
	user, err := suite.UserRepository.Get(1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, user.Id)
	assert.Equal(suite.T(), "Humbkr", user.Name)
	assert.Equal(suite.T(), "humbkr@gmail.com", user.Email)
	assert.Equal(suite.T(), "passwordHash", user.Password)
	assert.Equal(suite.T(), "testdata", user.Data)

	// Test to get a non-existing user.
	user, err = suite.UserRepository.Get(99)
	assert.NotNil(suite.T(), err)
}

func (suite *UserRepoTestSuite) TestGetAll() {
	users, err := suite.UserRepository.GetAll()
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), users)
	assert.Equal(suite.T(), 3, len(users))
	for _, user := range users {
		assert.NotEmpty(suite.T(), user.Id)
		assert.NotEmpty(suite.T(), user.Name)
		assert.NotEmpty(suite.T(), user.Email)
		assert.NotEmpty(suite.T(), user.Password)
		assert.NotEmpty(suite.T(), user.Data)
		assert.NotEmpty(suite.T(), user.Roles)
	}
}

func (suite *UserRepoTestSuite) TestSave() {
	// Test to save a new user.
	newUser := &business.User{
		Name:     "Test",
		Email:    "test@test.com",
		Password: "passwordHash",
		Data:     "testdata",
		Roles:    []business.Role{business.ROLE_LISTENER},
	}

	err := suite.UserRepository.Save(newUser)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newUser.Id)

	insertedNewUser, errInsert := suite.UserRepository.Get(newUser.Id)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newUser.Id, insertedNewUser.Id)
	assert.Equal(suite.T(), "Test", insertedNewUser.Name)
	assert.Equal(suite.T(), "test@test.com", insertedNewUser.Email)
	assert.Equal(suite.T(), "passwordHash", insertedNewUser.Password)
	assert.Equal(suite.T(), "testdata", insertedNewUser.Data)
	assert.Equal(suite.T(), []business.Role{business.ROLE_LISTENER}, insertedNewUser.Roles)

	// Test to update the user.
	insertedNewUser.Name = "Test updated"
	insertedNewUser.Email = "test.updated@test.com"
	insertedNewUser.Password = "updatedPasswordHash"
	insertedNewUser.Data = "testdataupdated"
	insertedNewUser.Roles = append(insertedNewUser.Roles, business.ROLE_ADMIN)
	errUpdate := suite.UserRepository.Save(&insertedNewUser)
	assert.Nil(suite.T(), errUpdate)
	assert.Equal(suite.T(), newUser.Id, insertedNewUser.Id)

	updatedUser, errGetMod := suite.UserRepository.Get(newUser.Id)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newUser.Id, updatedUser.Id)
	assert.Equal(suite.T(), "Test updated", updatedUser.Name)
	assert.Equal(suite.T(), "test.updated@test.com", updatedUser.Email)
	assert.Equal(suite.T(), "updatedPasswordHash", updatedUser.Password)
	assert.Equal(suite.T(), "testdataupdated", updatedUser.Data)
	assert.Equal(suite.T(), []business.Role{business.ROLE_ADMIN, business.ROLE_LISTENER}, updatedUser.Roles)
}

func (suite *UserRepoTestSuite) TestDelete() {
	var userId = 3

	// Get user to delete.
	user, err := suite.UserRepository.Get(userId)
	assert.Nil(suite.T(), err)

	// Delete user.
	err = suite.UserRepository.Delete(&user)
	assert.Nil(suite.T(), err)

	// Check user has been removed from the database.
	_, err = suite.UserRepository.Get(userId)
	assert.NotNil(suite.T(), err)
}

func (suite *UserRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.UserRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non-existing data.
	exists = suite.UserRepository.Exists(99)
	assert.False(suite.T(), exists)
}
