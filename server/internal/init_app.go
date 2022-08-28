package internal

import (
	"fmt"
	"gopkg.in/natefinch/lumberjack.v2"
	"log"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/interfaces"
	"github.com/spf13/viper"
)

func InitApp() (business.LibraryInteractor, business.UsersInteractor) {
	// Set default configuration.
	// Database.
	viper.SetDefault("DB.Driver", "sqlite3")
	viper.SetDefault("DB.File", "./alba.db")
	// Covers.
	viper.SetDefault("Covers.Directory", "./covers")
	viper.SetDefault("Covers.PreferredSource", "folder")
	// Logging.
	viper.SetDefault("Log.Enabled", false)
	viper.SetDefault("Log.File", "app.log")
	viper.SetDefault("Log.Path", "./")
	// Webserver.
	viper.SetDefault("Server.Port", "8888")
	viper.SetDefault("Server.Https.Enabled", false)
	viper.SetDefault("Server.Https.CertFile", "")
	viper.SetDefault("Server.Https.KeyFile", "")
	// Authentication.
	viper.SetDefault("Auth.Enabled", true)
	// Library.
	viper.SetDefault("Library.Path", "")
	// Dev mode.
	viper.SetDefault("DevMode.Enabled", false)

	// Load app configuration from file.
	viper.SetConfigName("alba")
	viper.AddConfigPath("./")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error loading config file: %s \n", err))
	}

	// Initialize logging system.
	log.SetOutput(&lumberjack.Logger{
		Filename:   viper.GetString("Log.Path") + viper.GetString("Log.File"),
		MaxSize:    10, // Megabytes.
		MaxBackups: 3,
		MaxAge:     15, // Days.
	})

	// Create app context.
	var appContext interfaces.AppContext
	datasource, err := interfaces.InitAlbaDatasource(viper.GetString("DB.driver"), viper.GetString("DB.file"))
	if err != nil {
		panic(fmt.Errorf("Error during the application context creation: %s \n", err))
	}
	appContext.DB = datasource

	// Instantiate all we need to work on the media library.
	libraryInteractor := business.LibraryInteractor{}
	libraryInteractor.ArtistRepository = interfaces.ArtistDbRepository{AppContext: &appContext}
	libraryInteractor.AlbumRepository = interfaces.AlbumDbRepository{AppContext: &appContext}
	libraryInteractor.TrackRepository = interfaces.TrackDbRepository{AppContext: &appContext}
	libraryInteractor.CoverRepository = interfaces.CoverDbRepository{AppContext: &appContext}
	libraryInteractor.LibraryRepository = interfaces.LibraryDbRepository{AppContext: &appContext}
	libraryInteractor.MediaFileRepository = interfaces.LocalFilesystemRepository{AppContext: &appContext}
	libraryInteractor.InternalVariableRepository = interfaces.InternalVariableDbRepository{AppContext: &appContext}

	// Instantiate all we need to work on users.
	usersInteractor := business.UsersInteractor{}
	usersInteractor.UserRepository = interfaces.UserDbRepository{AppContext: &appContext}

	return libraryInteractor, usersInteractor
}
