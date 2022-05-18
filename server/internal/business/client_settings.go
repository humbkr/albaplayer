package business

import "github.com/spf13/viper"

/*
 * This package exposes the data and operations regarding settings available from the client.
 * All app-wide settings are stored in the alba.yml file.
 */

type ClientSettings struct {
	LibraryPath                 string
	CoversPreferredSource       string
	DisableLibraryConfiguration bool
}

type ClientSettingsInteractor struct{}

func (si *ClientSettingsInteractor) GetSettings() ClientSettings {
	var settings ClientSettings

	settings.DisableLibraryConfiguration = viper.GetBool("ClientSettings.DisableLibraryConfiguration")
	settings.LibraryPath = viper.GetString("Library.Path")
	settings.CoversPreferredSource = viper.GetString("Covers.PreferredSource")

	return settings
}
