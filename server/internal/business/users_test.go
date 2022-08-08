package business

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type UsersInteractorTestSuite struct {
	suite.Suite
	// UsersInteractor where is located what to test.
	UsersInteractor *UsersInteractor
}

/*
*
Go testing framework entry point.
*/
func TestUsersInteractorTestSuite(t *testing.T) {
	suite.Run(t, new(UsersInteractorTestSuite))
}

func (suite *UsersInteractorTestSuite) SetupSuite() {
	suite.UsersInteractor = createMockUsersInteractor()
}

func (suite *UsersInteractorTestSuite) TestGetUser() {
	// Test entity retrieval.
	entity, err := suite.UsersInteractor.GetUser(1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), entity.Id)
	assert.NotEmpty(suite.T(), entity.Name)
	assert.NotEmpty(suite.T(), entity.Email)
	assert.NotEmpty(suite.T(), entity.Password)
	assert.NotEmpty(suite.T(), entity.DateAdded)
	assert.NotEmpty(suite.T(), entity.Roles)

	// Test to get a non-existing entity.
	entity, err = suite.UsersInteractor.GetUser(99)
	assert.NotNil(suite.T(), err)
}

func (suite *UsersInteractorTestSuite) TestGetAllUsers() {
	// Test to get entities.
	entities, err := suite.UsersInteractor.GetAllUsers()
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), entities)
	for _, entity := range entities {
		assert.NotEmpty(suite.T(), entity.Id)
		assert.NotEmpty(suite.T(), entity.Name)
		assert.NotEmpty(suite.T(), entity.Email)
		assert.NotEmpty(suite.T(), entity.Password)
		assert.NotEmpty(suite.T(), entity.DateAdded)
		assert.NotEmpty(suite.T(), entity.Roles)
	}
}

func (suite *UsersInteractorTestSuite) TestSaveUser() {
	// Test to save a new entity.
	newEntity := &User{
		Name:      "User",
		Email:     "user@test.com",
		Password:  "encoded_password",
		Roles:     []Role{ROLE_LISTENER},
		DateAdded: time.Now().Unix(),
	}

	err := suite.UsersInteractor.SaveUser(newEntity)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newEntity.Id)

	// Test to update the entity.
	newEntityId := newEntity.Id
	newEntity.Name = "Updated user"
	errUpdate := suite.UsersInteractor.SaveUser(newEntity)
	assert.Nil(suite.T(), errUpdate)
	assert.Equal(suite.T(), newEntity.Id, newEntityId)
	assert.Equal(suite.T(), "Updated user", newEntity.Name)

	// Test to insert an empty entity.
	newEntityEmpty := &User{}

	errNoTitle := suite.UsersInteractor.SaveUser(newEntityEmpty)
	assert.NotNil(suite.T(), errNoTitle)
}

func (suite *UsersInteractorTestSuite) TestDeleteUser() {
	// Delete entity.
	entity := &User{Id: 1}
	err := suite.UsersInteractor.DeleteUser(entity)
	assert.Nil(suite.T(), err)

	// Delete non-existing entity.
	entityFake := &User{Id: 55}
	errFake := suite.UsersInteractor.DeleteUser(entityFake)
	assert.Nil(suite.T(), errFake)

	// Try to Delete an album which id is not provided.
	entityNoId := &User{}
	errNoId := suite.UsersInteractor.DeleteUser(entityNoId)
	assert.NotNil(suite.T(), errNoId)
}
