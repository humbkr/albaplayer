package business

import (
	"testing"
	"github.com/stretchr/testify/suite"
	"github.com/stretchr/testify/assert"
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
)

type ArtistInteractorTestSuite struct {
	suite.Suite
	// LibraryInteractor where is located what to test.
	Library *LibraryInteractor
}

/**
Go testing framework entry point.
 */
func TestArtistRepoTestSuite(t *testing.T) {
	suite.Run(t, new(ArtistInteractorTestSuite))
}

func (suite *ArtistInteractorTestSuite) SetupSuite() {
	suite.Library = createMockLibraryInteractor()
}

func (suite *ArtistInteractorTestSuite) TestGetArtist() {
	// Test artist retrieval.
	artist, err := suite.Library.GetArtist(1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artist.Id)
	// Make sure artist has been hydrated.
	assert.NotEmpty(suite.T(), artist.Albums)

	// Test to get a non existing artist.
	artist, err = suite.Library.GetArtist(99)
	assert.NotNil(suite.T(), err)
}

func (suite *ArtistInteractorTestSuite) TestGetAllArtists() {
	// Test to get artists excluding albums.
	artists, err := suite.Library.GetAllArtists(false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artists)
	for _, artist := range artists {
		assert.NotEmpty(suite.T(), artist.Id)
		assert.NotEmpty(suite.T(), artist.Name)
		assert.Empty(suite.T(), artist.Albums)
	}

	// Test to get artists including albums.
	artists, err = suite.Library.GetAllArtists(true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), artists)
	for _, artist := range artists {
		assert.NotEmpty(suite.T(), artist.Id)
		assert.NotEmpty(suite.T(), artist.Name)
		assert.NotEmpty(suite.T(), artist.Albums)
	}
}

func (suite *ArtistInteractorTestSuite) TestSaveArtist() {
	// Test to save a new artist.
	newArtist := &domain.Artist{
		Name: "Insert new artist test",
	}

	err := suite.Library.SaveArtist(newArtist)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newArtist.Id)

	// Test to update the artist.
	newArtistId := newArtist.Id
	newArtist.Name = "Update artist test"
	errUpdate := suite.Library.SaveArtist(newArtist)
	assert.Nil(suite.T(), errUpdate)
	assert.Equal(suite.T(), newArtist.Id, newArtistId)
	assert.Equal(suite.T(), "Update artist test", newArtist.Name)
	assert.Empty(suite.T(), newArtist.Albums)

	// Test to insert an artist without name.
	newArtistNoName := &domain.Artist{}

	errNoTitle := suite.Library.SaveArtist(newArtistNoName)
	assert.NotNil(suite.T(), errNoTitle)

	// Test to update an album with an empty title.
	newArtist.Name = ""
	errUpdateEmptyTitle := suite.Library.SaveArtist(newArtist)
	assert.NotNil(suite.T(), errUpdateEmptyTitle)
}

func (suite *ArtistInteractorTestSuite) TestDeleteArtist() {
	// Delete artist.
	artist := &domain.Artist{Id: 1}
	err := suite.Library.DeleteArtist(artist)
	assert.Nil(suite.T(), err)

	// Delete non existant album.
	artistFake := &domain.Artist{Id: 55}
	errFake := suite.Library.DeleteArtist(artistFake)
	assert.Nil(suite.T(), errFake)

	// Try to Delete an album which id is not provided.
	artistNoId := &domain.Artist{}
	errNoId := suite.Library.DeleteArtist(artistNoId)
	assert.NotNil(suite.T(), errNoId)
}


type AlbumInteractorTestSuite struct {
	suite.Suite
	// LibraryInteractor where is located what to test.
	Library *LibraryInteractor
}

// Go testing framework entry point.
func TestAlbumRepoTestSuite(t *testing.T) {
	suite.Run(t, new(AlbumInteractorTestSuite))
}

func (suite *AlbumInteractorTestSuite) SetupSuite() {
	suite.Library = createMockLibraryInteractor()
}

func (suite *AlbumInteractorTestSuite) TestGetAlbum() {
	// Test album retrieval.
	album, err := suite.Library.GetAlbum(1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), album.Id)
	assert.NotEmpty(suite.T(), album.Tracks)

	// Test to get a non existing album.
	album, err = suite.Library.GetAlbum(99)
	assert.NotNil(suite.T(), err)
}

func (suite *AlbumInteractorTestSuite) TestGetAllAlbums() {
	// Test to get albums without tracks.
	albums, err := suite.Library.GetAllAlbums(false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.Empty(suite.T(), album.Tracks)
	}

	// Test to get albums with tracks.
	albums, err = suite.Library.GetAllAlbums(true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.NotEmpty(suite.T(), album.Title)
		assert.NotEmpty(suite.T(), album.Tracks)
	}
}

func (suite *AlbumInteractorTestSuite) TestGetAlbumsForArtist() {
	// Test to get albums without tracks.
	albums, err := suite.Library.GetAlbumsForArtist(1, false)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.Equal(suite.T(), 1, album.ArtistId)
		assert.NotEmpty(suite.T(), album.Title)
		assert.Empty(suite.T(), album.Tracks)
	}

	// Test to get albums with tracks.
	albums, err = suite.Library.GetAlbumsForArtist(1, true)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), albums)
	for _, album := range albums {
		assert.NotEmpty(suite.T(), album.Id)
		assert.Equal(suite.T(), 1, album.ArtistId)
		assert.NotEmpty(suite.T(), album.Title)
		assert.NotEmpty(suite.T(), album.Tracks)

		for _, track := range album.Tracks {
			assert.NotEmpty(suite.T(), track.Id)
			assert.Equal(suite.T(), album.Id, track.AlbumId)
			assert.Equal(suite.T(), album.ArtistId, track.ArtistId)
			assert.NotEmpty(suite.T(), track.Title)
		}
	}

	// Test to get albums for a non existant artist (or an artist without album).
	albums, err = suite.Library.GetAlbumsForArtist(34, false)
	assert.NotNil(suite.T(), err)
}

func (suite *AlbumInteractorTestSuite) TestSaveAlbum() {
	// Test to save a new album.
	newAlbum := &domain.Album{
		ArtistId: 1,
		Title: "Insert new album test",
		Year: "2017",
	}

	err := suite.Library.SaveAlbum(newAlbum)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newAlbum.Id)

	// Test to update the album.
	newAlbum.Title = "Update album test"
	newAlbum.Year = "1988"
	newAlbum.ArtistId = 1
	errUpdate := suite.Library.SaveAlbum(newAlbum)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), newAlbum.Id)

	// Test to insert an album without title.
	newAlbumNoTitle := &domain.Album{
		ArtistId: 2,
		Year: "2017",
	}

	errNoTitle := suite.Library.SaveAlbum(newAlbumNoTitle)
	assert.NotNil(suite.T(), errNoTitle)

	// Test to insert an album with a non existant artist id.
	newAlbumFakeArtistId := &domain.Album{
		ArtistId: 77,
		Title: "Test invalid artist id",
		Year: "2017",
	}

	errInvalidArtist := suite.Library.SaveAlbum(newAlbumFakeArtistId)
	assert.NotNil(suite.T(), errInvalidArtist)

	// Test to update an album with an empty title.
	newAlbum.Title = ""
	errUpdateEmptyTitle := suite.Library.SaveAlbum(newAlbum)
	assert.NotNil(suite.T(), errUpdateEmptyTitle)
}

func (suite *AlbumInteractorTestSuite) TestDeleteAlbum() {
	// Delete album.
	album := &domain.Album{Id: 1}
	err := suite.Library.DeleteAlbum(album)
	assert.Nil(suite.T(), err)

	// Delete non existant album.
	albumFake := &domain.Album{Id: 55}
	errFake := suite.Library.DeleteAlbum(albumFake)
	assert.Nil(suite.T(), errFake)

	// Try to Delete an album which id is not provided.
	albumNoId := &domain.Album{}
	errNoId := suite.Library.DeleteAlbum(albumNoId)
	assert.NotNil(suite.T(), errNoId)
}


type TrackInteractorTestSuite struct {
	suite.Suite
	// LibraryInteractor where is located what to test.
	Library *LibraryInteractor
}

/**
Go testing framework entry point.
 */
func TestTrackRepoTestSuite(t *testing.T) {
	suite.Run(t, new(TrackInteractorTestSuite))
}

func (suite *TrackInteractorTestSuite) SetupSuite() {
	suite.Library = createMockLibraryInteractor()
}

func (suite *TrackInteractorTestSuite) TestGetTrack() {
	// Test track retrieval.
	track, err := suite.Library.GetTrack(1)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), 1, track.Id)
	assert.NotEmpty(suite.T(), track.Title)
	assert.NotEmpty(suite.T(), track.Path)

	// Test to get a non existing track.
	track, err = suite.Library.GetTrack(99)
	assert.NotNil(suite.T(), err)
}

func (suite *TrackInteractorTestSuite) TestGetAllTracks() {
	tracks, err := suite.Library.GetAllTracks()
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), tracks)
	for _, track := range tracks {
		assert.NotEmpty(suite.T(), track.Id)
		assert.NotEmpty(suite.T(), track.Title)
		assert.NotEmpty(suite.T(), track.Path)
	}
}

func (suite *TrackInteractorTestSuite) TestGetTracksForAlbum() {
	// Test with valid album id.
	tracks, err := suite.Library.GetTracksForAlbum(1)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), tracks)
	for _, track := range tracks {
		assert.NotEmpty(suite.T(), track.Id)
		assert.Equal(suite.T(), 1, track.AlbumId)
		assert.NotEmpty(suite.T(), track.Title)
		assert.NotEmpty(suite.T(), track.Path)
	}

	// Test with invalid album id.
	tracks, err = suite.Library.GetTracksForAlbum(54)
	assert.NotNil(suite.T(), err)
}

func (suite *TrackInteractorTestSuite) TestSaveTrack() {
	// Test to save a new track.
	newTrack := &domain.Track{
		Title: "Insert new track test",
		Path: "/home/test/music/artist test/album test/05 - Insert new track test.mp3",
	}

	err := suite.Library.SaveTrack(newTrack)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newTrack.Id)


	// Test to update the track with valid data.
	newTrack.Title = "Update track test"
	newTrack.Path = "/home/test/music/artist test/album test/05 - Update track test.mp3"
	errUpdate := suite.Library.SaveTrack(newTrack)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), newTrack.Id)

	// Test to insert a track without title.
	newTrackNoTitle := &domain.Track{
		Path: "/test insert no title.mp3",
	}

	errNoTitle := suite.Library.SaveTrack(newTrackNoTitle)
	assert.NotNil(suite.T(), errNoTitle)

	// Test to insert a track without path.
	newTrackNoPath := &domain.Track{
		Title: "Test insert track no path",
	}

	errNoPath := suite.Library.SaveTrack(newTrackNoPath)
	assert.NotNil(suite.T(), errNoPath)

	// Test to insert a track with a non existant artist id.
	newTrackInvalidArtist := &domain.Track{
		ArtistId:765,
		Title: "Test insert track invalid artist",
		Path: "/home/test/music/artist test/album test/05 - Insert new track invalid artist.mp3",
	}

	errInvalidArtist := suite.Library.SaveTrack(newTrackInvalidArtist)
	assert.NotNil(suite.T(), errInvalidArtist)

	// Test to insert a track with a non existant album id.
	newTrackInvalidAlbum := &domain.Track{
		AlbumId:765,
		Title: "Test insert track invalid artist",
		Path: "/home/test/music/artist test/album test/05 - Insert new track invalid artist.mp3",
	}

	errInvalidAlbum := suite.Library.SaveTrack(newTrackInvalidAlbum)
	assert.NotNil(suite.T(), errInvalidAlbum)

	// Test to update a track with an empty title.
	newTrack.Title = ""
	errUpdateEmptyTitle := suite.Library.SaveTrack(newTrack)
	assert.NotNil(suite.T(), errUpdateEmptyTitle)
}

func (suite *TrackInteractorTestSuite) TestDeleteTrack() {
	// Delete track.
	track := &domain.Track{Id: 1}
	err := suite.Library.DeleteTrack(track)
	assert.Nil(suite.T(), err)

	// Delete non existant album.
	trackFake := &domain.Track{Id: 55}
	errFake := suite.Library.DeleteTrack(trackFake)
	assert.Nil(suite.T(), errFake)

	// Try to Delete an album which id is not provided.
	trackNoId := &domain.Track{}
	errNoId := suite.Library.DeleteTrack(trackNoId)
	assert.NotNil(suite.T(), errNoId)
}

func (suite *TrackInteractorTestSuite) TestTrackExists() {
	// Valid track.
	exists := suite.Library.TrackExists(1)
	assert.True(suite.T(), exists)

	// Invalid track.
	exists = suite.Library.TrackExists(432)
	assert.False(suite.T(), exists)
}


type CoverInteractorTestSuite struct {
	suite.Suite
	// LibraryInteractor where is located what to test.
	Library *LibraryInteractor
}

/*
Go testing framework entry point.
 */
func TestCoverRepoTestSuite(t *testing.T) {
	suite.Run(t, new(CoverInteractorTestSuite))
}

func (suite *CoverInteractorTestSuite) SetupSuite() {
	suite.Library = createMockLibraryInteractor()
}

func (suite *CoverInteractorTestSuite) TestCoverExists() {
	// Valid cover.
	exists := suite.Library.CoverExists(1)
	assert.True(suite.T(), exists)

	// Invalid cover.
	exists = suite.Library.CoverExists(432)
	assert.False(suite.T(), exists)
}

func (suite *CoverInteractorTestSuite) TestCoverHashExists() {
	// Valid cover.
	exists := suite.Library.CoverHashExists("8f338837a96141e96d663b67e464648e")
	assert.Equal(suite.T(), 1, exists)

	// Invalid cover.
	exists = suite.Library.CoverHashExists("00000837a96141e96d663b67e464648e")
	assert.Equal(suite.T(), 0, exists)
}

func (suite *CoverInteractorTestSuite) TestSaveCover() {
	// Test to save a new cover.
	newCover := &domain.Cover{
		Path: "/path/to/cover/8f338837a96141e96d663b67e464648e.jpg",
		Hash: "8f338837a96141e96d663b67e464648e",
	}

	err := suite.Library.SaveCover(newCover)
	assert.Nil(suite.T(), err)
	assert.NotEmpty(suite.T(), newCover.Id)

	// Test to update the cover.
	newCover.Path = "/path/to/cover/9f338837a96141e96d663b67e464648e.jpg"
	newCover.Hash = "9f338837a96141e96d663b67e464648e"
	errUpdate := suite.Library.SaveCover(newCover)
	assert.Nil(suite.T(), errUpdate)
	assert.NotEmpty(suite.T(), newCover.Id)

	// Test to update a cover with an empty hash.
	newCover.Hash = ""
	errUpdateEmptyHash := suite.Library.SaveCover(newCover)
	assert.NotNil(suite.T(), errUpdateEmptyHash)

	// Test to update a cover with an empty path.
	newCover.Hash = "9f338837a96141e96d663b67e464648e"
	newCover.Path = ""
	errUpdateEmptyPath := suite.Library.SaveCover(newCover)
	assert.NotNil(suite.T(), errUpdateEmptyPath)
}

func (suite *CoverInteractorTestSuite) TestDeleteCover() {
	// Delete cover.
	cover := &domain.Cover{Id: 1}
	err := suite.Library.DeleteCover(cover)
	assert.Nil(suite.T(), err)

	// Delete non existant cover.
	coverFake := &domain.Cover{Id: 55}
	errFake := suite.Library.DeleteCover(coverFake)
	assert.Nil(suite.T(), errFake)

	// Try to delete a cover which id is not provided.
	coverNoId := &domain.Cover{}
	errNoId := suite.Library.DeleteCover(coverNoId)
	assert.NotNil(suite.T(), errNoId)
}

/*
Following tests are basically useless except for code coverage in case of an exception occurring or something.
*/

type MediaFilesInteractorTestSuite struct {
	suite.Suite
	// LibraryInteractor where is located what to test.
	Library *LibraryInteractor
}

/*
Go testing framework entry point.
 */
func TestMediaFilesRepoTestSuite(t *testing.T) {
	suite.Run(t, new(MediaFilesInteractorTestSuite))
}

func (suite *MediaFilesInteractorTestSuite) SetupSuite() {
	suite.Library = createMockLibraryInteractor()
}

func (suite *MediaFilesInteractorTestSuite) TestUpdateLibrary() {
	suite.Library.UpdateLibrary()
}

func (suite *MediaFilesInteractorTestSuite) TestEraseLibrary() {
	suite.Library.EraseLibrary()
}

func (suite *MediaFilesInteractorTestSuite) TestCleanUpLibrary() {
	suite.Library.CleanUpLibrary()
}

func (suite *MediaFilesInteractorTestSuite) TestCreateCompilationArtist() {
	_ = suite.Library.CreateCompilationArtist()
}
