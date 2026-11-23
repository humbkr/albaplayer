package interfaces

import (
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/humbkr/albaplayer/internal/utils"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"os"
	"testing"
	"time"
)

type LocalFSRepoTestSuite struct {
	suite.Suite
	LocalFSRepository LocalFilesystemRepository
	ArtistRepository  ArtistDbRepository
	AlbumRepository   AlbumDbRepository
	TrackRepository   TrackDbRepository
	CoverRepository   CoverDbRepository
}

// Go testing framework entry point.
func TestLocalFSRepoTestSuite(t *testing.T) {
	suite.Run(t, new(LocalFSRepoTestSuite))
}

func (suite *LocalFSRepoTestSuite) SetupSuite() {
	coversDir := utils.GetOSTempDir() + "covers"
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

	_, err = ds.Exec("INSERT INTO artists(id, name, created_at) VALUES(?, ?, ?)", 1, business.LibraryDefaultCompilationArtist, time.Now().Unix())
	if err != nil {
		log.Fatal(err)
	}

	appContext := AppContext{DB: ds}
	suite.LocalFSRepository = LocalFilesystemRepository{AppContext: &appContext}
	suite.ArtistRepository = ArtistDbRepository{AppContext: &appContext}
	suite.AlbumRepository = AlbumDbRepository{AppContext: &appContext}
	suite.TrackRepository = TrackDbRepository{AppContext: &appContext}
	suite.CoverRepository = CoverDbRepository{AppContext: &appContext}
}

func (suite *LocalFSRepoTestSuite) TearDownSuite() {
	coversDir := utils.GetOSTempDir() + "covers"
	if _, err := os.Stat(coversDir); err == nil {
		_ = os.Remove(coversDir)
	}
}

func (suite *LocalFSRepoTestSuite) SetupTest() {}

/*
 * Blackbox tests.
 */

func (suite *LocalFSRepoTestSuite) TestScanMediaFiles() {
	// Test with non-existing directory.
	_, _, err := suite.LocalFSRepository.ScanMediaFiles("/what/ever", true, nil)
	assert.NotNil(suite.T(), err)

	// Test with empty directory.
	_, _, err = suite.LocalFSRepository.ScanMediaFiles(TestFSEmptyLibDir, true, nil)
	assert.Nil(suite.T(), err)

	processed, added, err := suite.LocalFSRepository.ScanMediaFiles(TestFSLibDir, true, nil)
	assert.Nil(suite.T(), err)
	// TODO change test once return values computing is coded.
	assert.Equal(suite.T(), 0, processed)
	assert.Equal(suite.T(), 0, added)

	// Test that info has been inserted in database.
	_, errGetDefaultCompilationArtist := suite.ArtistRepository.GetByName(business.LibraryDefaultCompilationArtist)
	assert.Nil(suite.T(), errGetDefaultCompilationArtist)

	// Test track.
	var track domain.Track
	errGet := suite.TrackRepository.AppContext.DB.
		QueryRow(
			"SELECT id, title, album_id, artist_id, cover_id, disc, number, duration, genre, path, created_at FROM tracks WHERE title = ?",
			"Artist #2 - Album #1 - Track #1",
		).
		Scan(&track.Id, &track.Title, &track.AlbumId, &track.ArtistId, &track.CoverId, &track.Disc, &track.Number, &track.Duration, &track.Genre, &track.Path, &track.DateAdded)
	assert.Nil(suite.T(), errGet)
	assert.Equal(suite.T(), "Artist #2 - Album #1 - Track #1", track.Title)
	assert.Equal(suite.T(), 0, track.CoverId)
	assert.Equal(suite.T(), "1/2", track.Disc)
	assert.Equal(suite.T(), 1, track.Number)
	// Test files are 0.1s long, so the duration rounds to 0.
	assert.Equal(suite.T(), 0, track.Duration)
	assert.Equal(suite.T(), "Genre #3", track.Genre)
	assert.Equal(suite.T(), "../../testdata/mp3/artist 2/Artist 2 - Album 1 - Track 1.mp3", track.Path)

	// Test the album of the track.
	album, errGetAlbum := suite.AlbumRepository.Get(track.AlbumId, false)
	assert.Nil(suite.T(), errGetAlbum)
	assert.Equal(suite.T(), "Artist #2 - Album #1", album.Title)
	assert.Equal(suite.T(), "2017", album.Year)
	assert.Equal(suite.T(), 0, album.CoverId)

	// Test the artist of the track.
	artist, errGetArtist := suite.ArtistRepository.Get(track.ArtistId, false)
	assert.Nil(suite.T(), errGetArtist)
	assert.Equal(suite.T(), "Artist #2", artist.Name)

	// Test compilations processing.
	var compilationTrack = domain.Track{}
	errCompilationTrack := suite.TrackRepository.AppContext.DB.
		QueryRow(
			"SELECT id, title, album_id, artist_id, cover_id, disc, number, duration, genre, path, created_at FROM tracks WHERE path = ?",
			"../../testdata/mp3/compilation/Artist 1 - Compilation - Track 1.mp3",
		).
		Scan(&compilationTrack.Id, &compilationTrack.Title, &compilationTrack.AlbumId, &compilationTrack.ArtistId, &compilationTrack.CoverId, &compilationTrack.Disc, &compilationTrack.Number, &compilationTrack.Duration, &compilationTrack.Genre, &compilationTrack.Path, &compilationTrack.DateAdded)
	assert.Nil(suite.T(), errCompilationTrack)

	compilationAlbum, errCompilationAlbum := suite.AlbumRepository.Get(compilationTrack.AlbumId, false)
	assert.Nil(suite.T(), errCompilationAlbum)

	compilationAlbumArtist, errCompilationAlbumArtist := suite.ArtistRepository.Get(compilationAlbum.ArtistId, false)
	assert.Nil(suite.T(), errCompilationAlbumArtist)
	assert.Equal(suite.T(), business.LibraryDefaultCompilationArtist, compilationAlbumArtist.Name)

	// TODO test more, this is not exhaustive.
}

func (suite *LocalFSRepoTestSuite) TestMediaFileExists() {
	// Test with an existing media file.
	exists := suite.LocalFSRepository.MediaFileExists(TestFSLibDir + "/no artist - no album - no title.mp3")
	assert.True(suite.T(), exists)

	// Test with a non-existing media file.
	exists = suite.LocalFSRepository.MediaFileExists(TestFSLibDir + "/whatever.mp3")
	assert.False(suite.T(), exists)
}

// TODO test LocalFSRepository.WriteCoverFile.
// TODO test LocalFSRepository.RemoveCoverFile.
// TODO test LocalFSRepository.DeleteCovers.

/*
 * Below are whitebox (internal) tests.
 */

// TODO Cannot test these functions directly because Transaction is not abstracted.
func (suite *LocalFSRepoTestSuite) TestProcessArtist()          {}
func (suite *LocalFSRepoTestSuite) TestProcessAlbum()           {}
func (suite *LocalFSRepoTestSuite) TestProcessTrack()           {}
func (suite *LocalFSRepoTestSuite) TestProcessCover()           {}
func (suite *LocalFSRepoTestSuite) TestWriteCoverFileInternal() {}

func (suite *LocalFSRepoTestSuite) TestGetMetadataFromFile() {
	// Test with almost full metadata.
	track := domain.Track{Path: TestFSLibDir + "/artist 1/artist 1 - album 1/Artist 1 - Album 1 - Track 1.mp3"}
	meta, err := getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "mpeg", meta.Format)
	assert.Equal(suite.T(), "Artist #1 - Album #1 - Track #1", meta.Title)
	assert.Equal(suite.T(), "Artist #1 - Album #1", meta.Album)
	assert.Equal(suite.T(), "Artist #1", meta.Artist)
	assert.Equal(suite.T(), "Genre #1", meta.Genre)
	assert.Equal(suite.T(), "2017", meta.Year)
	assert.Equal(suite.T(), 1, meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// Test files are 0.1s long, so the duration rounds to 0.
	assert.Equal(suite.T(), 0, meta.Duration)
	// Path will be different on each platform so we can only test it's not empty.
	assert.NotEmpty(suite.T(), meta.Path)

	// Test without artist nor album.
	track = domain.Track{Path: TestFSLibDir + "/no artist - no album - Track 1.mp3"}
	meta, err = getMetadataFromFile(track.Path)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "mpeg", meta.Format)
	assert.Equal(suite.T(), "No artist - no album - Track #1", meta.Title)
	assert.Empty(suite.T(), meta.Album)
	assert.Equal(suite.T(), business.LibraryDefaultArtist, meta.Artist)
	assert.Empty(suite.T(), meta.AlbumArtist)
	assert.Equal(suite.T(), "Genre #5", meta.Genre)
	assert.Equal(suite.T(), "2017", meta.Year)
	assert.Equal(suite.T(), 1, meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// Test files are 0.1s long, so the duration rounds to 0.
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
	assert.Equal(suite.T(), business.LibraryDefaultArtist, meta.Artist)
	assert.Empty(suite.T(), meta.Genre)
	assert.Empty(suite.T(), meta.Year)
	assert.Empty(suite.T(), meta.Track)
	assert.Empty(suite.T(), meta.Disc)
	assert.Empty(suite.T(), meta.Picture)
	// Test files are 0.1s long, so the duration rounds to 0.
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

	// Test with a file that is not valid audio: falls back to the file name.
	invalidFile := suite.T().TempDir() + "/not audio.mp3"
	assert.Nil(suite.T(), os.WriteFile(invalidFile, []byte("not an mp3"), 0644))
	meta, err = getMetadataFromFile(invalidFile)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), "not audio", meta.Title)
	assert.Empty(suite.T(), meta.Format)
	assert.Equal(suite.T(), 0, meta.Duration)

	// Test with non-existing file.
	meta, err = getMetadataFromFile("non/existant/file.mp3")
	assert.NotNil(suite.T(), err)

	return
}

func (suite *LocalFSRepoTestSuite) TestParseNumberAndTotal() {
	cases := map[string][2]int{
		"":     {0, 0},
		"3":    {3, 0},
		"3/12": {3, 12},
		" 1/2": {1, 2},
		"a/b":  {0, 0},
	}
	for value, expected := range cases {
		number, total := parseNumberAndTotal(value)
		assert.Equal(suite.T(), expected, [2]int{number, total}, value)
	}
}

func (suite *LocalFSRepoTestSuite) TestIsAudioFile() {
	assert.True(suite.T(), isAudioFile("track.mp3"))
	assert.True(suite.T(), isAudioFile("/music/album/Track.FLAC"))
	assert.False(suite.T(), isAudioFile("cover.jpg"))
	assert.False(suite.T(), isAudioFile("._track.mp3"))
	assert.False(suite.T(), isAudioFile("/music/album/._track.mp3"))
}

func (suite *LocalFSRepoTestSuite) TestJoinTagValues() {
	tags := map[string][]string{
		"GENRE": {"Stoner Rock", " ", "Doom "},
		"TITLE": {"Title"},
	}
	assert.Equal(suite.T(), "Stoner Rock; Doom", joinTagValues(tags, "GENRE"))
	assert.Equal(suite.T(), "Title", joinTagValues(tags, "TITLE"))
	assert.Equal(suite.T(), "", joinTagValues(tags, "ALBUM"))
}

func (suite *LocalFSRepoTestSuite) TestParseYear() {
	assert.Equal(suite.T(), 2017, parseYear("2017"))
	assert.Equal(suite.T(), 2017, parseYear("2017-05-21"))
	assert.Equal(suite.T(), 0, parseYear("17"))
	assert.Equal(suite.T(), 0, parseYear(""))
}

func (suite *LocalFSRepoTestSuite) TestImageExtensionFromMIME() {
	assert.Equal(suite.T(), "png", imageExtensionFromMIME("image/png"))
	assert.Equal(suite.T(), "gif", imageExtensionFromMIME("image/gif"))
	assert.Equal(suite.T(), "jpg", imageExtensionFromMIME("image/jpeg"))
	assert.Equal(suite.T(), "jpg", imageExtensionFromMIME(""))
}
