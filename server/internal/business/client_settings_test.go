package business

import (
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
)

type ClientSettingsInteractorTestSuite struct {
	suite.Suite
	// ClientSettingsInteractor where is located what to test.
	ClientSettings ClientSettingsInteractor
}

// Go testing framework entry point.
func TestClientSettingsTestSuite(t *testing.T) {
	suite.Run(t, new(ClientSettingsInteractorTestSuite))
}

func (suite *ClientSettingsInteractorTestSuite) SetupSuite() {
	usersInteractor := createMockUsersInteractor()
	suite.ClientSettings = ClientSettingsInteractor{
		UserInteractor: *usersInteractor,
	}
}

func (suite *ClientSettingsInteractorTestSuite) TestGetSettings() {
	// Set config file viper values for the test.
	viper.Set("ClientSettings.DisableLibraryConfiguration", true)
	viper.Set("Library.Path", "/this/is/a/test")
	viper.Set("Covers.PreferredSource", "file")

	// Test settings retrieval.
	settings := suite.ClientSettings.GetSettings()
	assert.True(suite.T(), settings.DisableLibraryConfiguration)
	assert.Equal(suite.T(), "/this/is/a/test", settings.LibraryPath)
	assert.Equal(suite.T(), "file", settings.CoversPreferredSource)
	assert.False(suite.T(), settings.AuthEnabled)
	assert.True(suite.T(), settings.AdminUserCreated)
}
