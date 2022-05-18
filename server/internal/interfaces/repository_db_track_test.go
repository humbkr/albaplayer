package interfaces

import (
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"log"
	"testing"
)

type TrackRepoTestSuite struct {
	suite.Suite
	TrackRepository TrackDbRepository
}

// Go testing framework entry point.
func TestTrackRepoTestSuite(t *testing.T) {
	suite.Run(t, new(TrackRepoTestSuite))
}

func (suite *TrackRepoTestSuite) SetupSuite() {
	ds, err := createTestDatasource()
	if err != nil {
		log.Fatal(err)
	}
	appContext := AppContext{DB: ds}
	suite.TrackRepository = TrackDbRepository{AppContext: &appContext}
}

func (suite *TrackRepoTestSuite) TearDownSuite() {
	if err := closeTestDataSource(suite.TrackRepository.AppContext.DB); err != nil {
		log.Fatal(err)
	}
}

func (suite *TrackRepoTestSuite) SetupTest() {
	err := resetTestDataSource(suite.TrackRepository.AppContext.DB)
	if err != nil {
		return
	}
}

func (suite *TrackRepoTestSuite) TestGet() {
	// Test track retrieval.
	track, err := suite.TrackRepository.Get(1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, track.Id)
	assert.Equal(suite.T(), 1, track.AlbumId)
	assert.Equal(suite.T(), 2, track.ArtistId)
	assert.Equal(suite.T(), "Stinkfist", track.Title)
	// We do not input anything in the db if there's only one disc, even if the tag is "1/1".
	assert.Empty(suite.T(), track.Disc)
	assert.Equal(suite.T(), 1, track.Number)
	assert.Equal(suite.T(), 311, track.Duration)
	assert.Equal(suite.T(), "Progressive Metal", track.Genre)
	assert.Equal(suite.T(), "/home/test/music/tool/aenima/01 - Stkinfist.mp3", track.Path)

	// TODO Test double disc albums.

	// Test to get a non-existing track.
	track, err = suite.TrackRepository.Get(99)
	assert.NotNil(suite.T(), err)
}

func (suite *TrackRepoTestSuite) TestGetAll() {
	tracks, err := suite.TrackRepository.GetAll()
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), tracks)
	assert.Equal(suite.T(), 16, len(tracks))
	for _, track := range tracks {
		assert.NotEmpty(suite.T(), track.Id)
		assert.NotEmpty(suite.T(), track.Title)
		assert.NotEmpty(suite.T(), track.Path)
	}
}

func (suite *TrackRepoTestSuite) TestGetMultiple() {
	tracks, err := suite.TrackRepository.GetMultiple([]int{4, 5, 10})
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), tracks)
	assert.Equal(suite.T(), 3, len(tracks))
	for _, track := range tracks {
		assert.NotEmpty(suite.T(), track.Id)
		assert.NotEmpty(suite.T(), track.Title)
		assert.NotEmpty(suite.T(), track.Path)
	}
}

func (suite *TrackRepoTestSuite) TestGetByName() {
	// Test track retrieval.
	track, err := suite.TrackRepository.GetByName("Forty Six & 2", 2, 1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 5, track.Id)
	assert.Equal(suite.T(), 1, track.AlbumId)
	assert.Equal(suite.T(), 2, track.ArtistId)
	assert.Equal(suite.T(), "Forty Six & 2", track.Title)
	// We do not input anything in the db if there's only one disc, even if the tag is "1/1".
	assert.Empty(suite.T(), track.Disc)
	assert.Equal(suite.T(), 5, track.Number)
	assert.Equal(suite.T(), 364, track.Duration)
	assert.Equal(suite.T(), "Progressive Metal", track.Genre)
	assert.Equal(suite.T(), "/home/test/music/tool/aenima/05 - Forty Six & 2.mp3", track.Path)

	// Test to get a track with non existant name.
	_, err = suite.TrackRepository.GetByName("Bogus", 2, 1)
	assert.NotNil(suite.T(), err)

	// Test to get a track with wrong artist id.
	_, err = suite.TrackRepository.GetByName("Forty Six & 2", 3, 1)
	assert.NotNil(suite.T(), err)

	// Test to get a track with wrong album id.
	_, err = suite.TrackRepository.GetByName("Forty Six & 2", 2, 2)
	assert.NotNil(suite.T(), err)
}

func (suite *TrackRepoTestSuite) TestGetTracksForAlbum() {
	tracks, err := suite.TrackRepository.GetTracksForAlbum(1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), tracks)
	assert.Equal(suite.T(), 15, len(tracks))
	for _, track := range tracks {
		assert.NotEmpty(suite.T(), track.Id)
		assert.Equal(suite.T(), 1, track.AlbumId)
		assert.NotEmpty(suite.T(), track.Title)
		assert.NotEmpty(suite.T(), track.Path)
	}
}

func (suite *TrackRepoTestSuite) TestSave() {
	// Test to save a new track.
	newTrack := &domain.Track{
		AlbumId:  2,
		ArtistId: 2,
		Title:    "Insert new track test",
		Disc:     "1/2",
		Number:   5,
		Duration: 321,
		Genre:    "Grunge",
		Path:     "/home/test/music/artist test/album test/05 - Insert new track test.mp3",
	}

	err := suite.TrackRepository.Save(newTrack)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newTrack.Id)

	insertednewTrack, errInsert := suite.TrackRepository.Get(newTrack.Id)
	assert.Nil(suite.T(), errInsert)
	assert.Equal(suite.T(), newTrack.Id, insertednewTrack.Id)
	assert.Equal(suite.T(), 2, insertednewTrack.AlbumId)
	assert.Equal(suite.T(), 2, insertednewTrack.ArtistId)
	assert.Equal(suite.T(), "Insert new track test", insertednewTrack.Title)
	assert.Equal(suite.T(), "1/2", insertednewTrack.Disc)
	assert.Equal(suite.T(), 5, insertednewTrack.Number)
	assert.Equal(suite.T(), 321, insertednewTrack.Duration)
	assert.Equal(suite.T(), "Grunge", insertednewTrack.Genre)
	assert.Equal(suite.T(), "/home/test/music/artist test/album test/05 - Insert new track test.mp3", insertednewTrack.Path)

	// Test to update the track with valid data.
	insertednewTrack.Title = "Update track test"
	insertednewTrack.AlbumId = 1
	insertednewTrack.ArtistId = 2
	insertednewTrack.Disc = "2/2"
	insertednewTrack.Number = 6
	insertednewTrack.Duration = 123
	insertednewTrack.Genre = "Thrash Metal"
	insertednewTrack.Path = "/home/test/music/artist test/album test/05 - Update track test.mp3"
	errUpdate := suite.TrackRepository.Save(&insertednewTrack)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), insertednewTrack.Id)

	updatedTrack, errGetMod := suite.TrackRepository.Get(newTrack.Id)
	assert.Nil(suite.T(), errGetMod)
	assert.Equal(suite.T(), newTrack.Id, updatedTrack.Id)
	assert.Equal(suite.T(), 1, updatedTrack.AlbumId)
	assert.Equal(suite.T(), 2, updatedTrack.ArtistId)
	assert.Equal(suite.T(), "Update track test", updatedTrack.Title)
	assert.Equal(suite.T(), "2/2", updatedTrack.Disc)
	assert.Equal(suite.T(), 6, updatedTrack.Number)
	assert.Equal(suite.T(), 123, updatedTrack.Duration)
	assert.Equal(suite.T(), "Thrash Metal", updatedTrack.Genre)
	assert.Equal(suite.T(), "/home/test/music/artist test/album test/05 - Update track test.mp3", updatedTrack.Path)

	// Test to insert a new track with a pre-populated trackId (= update a non-existent track).
	newTrackWithId := &domain.Track{
		Id:    88,
		Title: "New track bogus id",
		Path:  "/new bogus id.mp3",
	}

	errBogusId := suite.TrackRepository.Save(newTrackWithId)
	assert.Nil(suite.T(), errBogusId)
}

func (suite *TrackRepoTestSuite) TestDelete() {
	var trackId = 1

	// Get track to delete.
	track, err := suite.TrackRepository.Get(trackId)
	assert.Nil(suite.T(), err)

	// Delete track.
	err = suite.TrackRepository.Delete(&track)
	assert.Nil(suite.T(), err)

	// Check track has been removed from the database.
	_, err = suite.TrackRepository.Get(trackId)
	assert.NotNil(suite.T(), err)
}

func (suite *TrackRepoTestSuite) TestExists() {
	// Test with existing data.
	exists := suite.TrackRepository.Exists(1)
	assert.True(suite.T(), exists)

	// Test with non-existing data.
	exists = suite.TrackRepository.Exists(543)
	assert.False(suite.T(), exists)
}

func (suite *TrackRepoTestSuite) TestCount() {
	count, err := suite.TrackRepository.Count()
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 16, count)
}
