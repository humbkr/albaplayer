package interfaces

import (
	"github.com/humbkr/albaplayer/internal/alba/business"
	"github.com/stretchr/testify/suite"
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/humbkr/albaplayer/internal/alba/domain"
	"github.com/spf13/viper"
	"os"
	"log"
)

type LocalFSRepoTestSuite struct {
	suite.Suite
	LocalFSRepository LocalFilesystemRepository
}

// Go testing framework entry point.
func TestLocalFSRepoTestSuite(t *testing.T) {
	suite.Run(t, new(LocalFSRepoTestSuite))
}

func (suite *LocalFSRepoTestSuite) SetupSuite() {
	coversDir := os.TempDir() + "covers"
	if _, err := os.Stat(coversDir); os.IsNotExist(err) {
		_ = os.Mkdir(coversDir, 0755)
	}
	viper.Set("Covers.Directory", coversDir)

	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}

	err = clearTestDataSource(ds)
	if err != nil {
		log.Fatal(err)
	}

	_, err = ds.Exec("INSERT INTO artists(id, name) VALUES(?, ?)", 1, business.LibraryDefaultCompilationArtist)
	if err != nil {
		log.Fatal(err)
	}

	appContext := AppContext{DB: ds}
	suite.LocalFSRepository = LocalFilesystemRepository{AppContext: &appContext}
}

func (suite *LocalFSRepoTestSuite) TearDownSuite() {
	coversDir := os.TempDir() + string(os.PathSeparator) + "covers"
	if _, err := os.Stat(coversDir); err == nil {
		_ = os.Remove(coversDir)
	}
}

func (suite *LocalFSRepoTestSuite) SetupTest() {}

/*
Blackbox tests.
 */

func (suite *LocalFSRepoTestSuite) TestScanMediaFiles() {
	// Test with non existing directory.
	_, _, err := suite.LocalFSRepository.ScanMediaFiles("/what/ever")
	assert.NotNil(suite.T(), err)

	// Test with empty directory.
	_, _, err = suite.LocalFSRepository.ScanMediaFiles(TestFSEmptyLibDir)
	assert.Nil(suite.T(), err)

	processed, added, err := suite.LocalFSRepository.ScanMediaFiles(TestFSLibDir)
	assert.Nil(suite.T(), err)
	// TODO change test once return values computing is coded.
	assert.Equal(suite.T(), 0, processed)
	assert.Equal(suite.T(), 0, added)

	// Test that info has been inserted in database.
	var defaultCompilationArtist = domain.Artist{}
	errGetDefaultCompilationArtist := suite.LocalFSRepository.AppContext.DB.SelectOne(&defaultCompilationArtist, "SELECT * FROM artists WHERE name = ?", business.LibraryDefaultCompilationArtist)
	assert.Nil(suite.T(), errGetDefaultCompilationArtist)

	// Test track.
	var track = domain.Track{}
	errGet := suite.LocalFSRepository.AppContext.DB.SelectOne(&track, "SELECT * FROM tracks WHERE title = ?", "Artist #2 - Album #1 - Track #1")
	assert.Nil(suite.T(), errGet)
	assert.Equal(suite.T(), "Artist #2 - Album #1 - Track #1", track.Title)
	assert.Equal(suite.T(), 0, track.CoverId)
	assert.Equal(suite.T(), "1/2", track.Disc)
	assert.Equal(suite.T(), 1, track.Number)
	// TODO Cannot test duration with the test file.
	assert.Equal(suite.T(), 0, track.Duration)
	assert.Equal(suite.T(), "Genre #3", track.Genre)
	assert.Equal(suite.T(), "../../../testdata/mp3/artist 2/Artist 2 - Album 1 - Track 1.mp3", track.Path)

	// Test the album of the track.
	var album = domain.Album{}
	errGetAlbum := suite.LocalFSRepository.AppContext.DB.SelectOne(&album, "SELECT * FROM albums WHERE id = ?", track.AlbumId)
	assert.Nil(suite.T(), errGetAlbum)
	assert.Equal(suite.T(), "Artist #2 - Album #1", album.Title)
	assert.Equal(suite.T(), "2017", album.Year)
	assert.Equal(suite.T(), 0, album.CoverId)

	// Test the artist of the track.
	var artist = domain.Artist{}
	errGetArtist := suite.LocalFSRepository.AppContext.DB.SelectOne(&artist, "SELECT * FROM artists WHERE id = ?", track.ArtistId)
	assert.Nil(suite.T(), errGetArtist)
	assert.Equal(suite.T(), "Artist #2", artist.Name)

	// Test compilations processing.
	var compilationTrack = domain.Track{}
	errCompilationTrack := suite.LocalFSRepository.AppContext.DB.SelectOne(
		&compilationTrack,
		"SELECT * FROM tracks WHERE path = ?", "../../../testdata/mp3/compilation/Artist 1 - Compilation - Track 1.mp3")
	assert.Nil(suite.T(), errCompilationTrack)

	var compilationAlbum = domain.Album{}
	errCompilationAlbum := suite.LocalFSRepository.AppContext.DB.SelectOne(
		&compilationAlbum,
		"SELECT * FROM albums WHERE id = ?", compilationTrack.AlbumId)
	assert.Nil(suite.T(), errCompilationAlbum)

	var compilationAlbumArtist = domain.Artist{}
	errCompilationAlbumArtist := suite.LocalFSRepository.AppContext.DB.SelectOne(
		&compilationAlbumArtist,
		"SELECT * FROM artists WHERE id = ?", compilationAlbum.ArtistId)
	assert.Nil(suite.T(), errCompilationAlbumArtist)
	assert.Equal(suite.T(), business.LibraryDefaultCompilationArtist, compilationAlbumArtist.Name)


	// TODO test more, this is not exhaustive.
}

func (suite *LocalFSRepoTestSuite) TestMediaFileExists() {
	// Test with an existing media file.
	exists := suite.LocalFSRepository.MediaFileExists(TestFSLibDir + "/no artist - no album - no title.mp3")
	assert.True(suite.T(), exists)

	// Test with a non existing media file.
	exists = suite.LocalFSRepository.MediaFileExists(TestFSLibDir + "/whatever.mp3")
	assert.False(suite.T(), exists)
}

// TODO test LocalFSRepository.WriteCoverFile.
// TODO test LocalFSRepository.RemoveCoverFile.
// TODO test LocalFSRepository.DeleteCovers.

/*
Below are whitebox (internal) tests.
 */

// TODO Cannot test these functions directly because gorp.Transaction is not abstracted.
func (suite *LocalFSRepoTestSuite) TestProcessArtist() {}
func (suite *LocalFSRepoTestSuite) TestProcessAlbum() {}
func (suite *LocalFSRepoTestSuite) TestProcessTrack() {}
func (suite *LocalFSRepoTestSuite) TestProcessCover() {}
func (suite *LocalFSRepoTestSuite) TestWriteCoverFileInternal() {}

func (suite *LocalFSRepoTestSuite) TestGetMetadataFromFile() {
	// Test with almost full metadata.
	track := domain.Track{Path: TestFSLibDir + "/artist 1/artist 1 - album 1/Artist 1 - Album 1 - Track 1.mp3"}
	meta, err := getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "MP3", meta.Format)
	assert.Equal(suite.T(), "Artist #1 - Album #1 - Track #1", meta.Title)
	assert.Equal(suite.T(), "Artist #1 - Album #1", meta.Album)
	assert.Equal(suite.T(), "Artist #1", meta.Artist)
	assert.Equal(suite.T(), "Genre #1", meta.Genre)
	assert.Equal(suite.T(), "2017", meta.Year)
	assert.Equal(suite.T(), 1, meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// TODO Cannot test duration with the test file.
	assert.Equal(suite.T(), 0, meta.Duration)
	// Path will be different on each platform so we can only test it's not empty.
	assert.NotEmpty(suite.T(), meta.Path)

	// Test without artist nor album.
	track = domain.Track{Path: TestFSLibDir + "/no artist - no album - Track 1.mp3"}
	meta, err = getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "MP3", meta.Format)
	assert.Equal(suite.T(), "No artist - no album - Track #1", meta.Title)
	assert.Empty(suite.T(), meta.Album)
	assert.Equal(suite.T(), business.LibraryDefaultArtist, meta.Artist)
	assert.Empty(suite.T(), meta.AlbumArtist)
	assert.Equal(suite.T(), "Genre #5", meta.Genre)
	assert.Equal(suite.T(), "2017", meta.Year)
	assert.Equal(suite.T(), 1, meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// TODO Cannot test duration with the test file.
	assert.Equal(suite.T(), 0, meta.Duration)
	// Path will be different on each platform so we can only test it's not empty.
	assert.NotEmpty(suite.T(), meta.Path)

	// Test without any tag.
	track = domain.Track{Path: TestFSLibDir + "/no artist - no album - no title.mp3"}
	meta, err = getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	// Should set the file name as a title.
	assert.Equal(suite.T(), "no artist - no album - no title", meta.Title)
	assert.Empty(suite.T(), meta.Album)
	assert.Empty(suite.T(), meta.Artist)
	assert.Empty(suite.T(), meta.Genre)
	assert.Empty(suite.T(), meta.Year)
	assert.Empty(suite.T(), meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// TODO Cannot test duration with the test file.
	assert.Equal(suite.T(), 0, meta.Duration)
	// Path will be different on each platform so we can only test it's not empty.
	assert.NotEmpty(suite.T(), meta.Path)

	// Test with multiple discs.
	track = domain.Track{Path: TestFSLibDir + "/artist 2/Artist 2 - Album 1 - Track 1.mp3"}
	meta, err = getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "1/2", meta.Disc)

	// Test with cover image in tags.
	track = domain.Track{Path: TestFSLibDir + "/no artist - album 1 - Track 1.mp3"}
	meta, err = getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "jpg", meta.Picture.Ext)
	assert.NotEmpty(suite.T(), meta.Picture.Data)

	// Test with non existant file.
	meta, err = getMetadataFromFile("non/existant/file.mp3")
	assert.NotNil(suite.T(), err)

	return
}
