package graph

import (
	"github.com/humbkr/albaplayer/internal/alba/business"
	"github.com/humbkr/albaplayer/internal/alba/domain"
	"github.com/humbkr/albaplayer/internal/alba/interfaces/graph/model"
)

func convertArtist(artist domain.Artist) model.Artist {
	return model.Artist{
		ID:        artist.Id,
		Name:      artist.Name,
		DateAdded: &artist.DateAdded,
	}
}

func convertAlbum(album domain.Album) model.Album {
	return model.Album{
		ID:        album.Id,
		Title:     album.Title,
		Year:      &album.Year,
		ArtistID:  album.ArtistId,
		Cover:     &album.CoverId,
		DateAdded: &album.DateAdded,
	}
}

func convertTrack(track domain.Track) model.Track {
	return model.Track{
		ID:        track.Id,
		Title:     track.Title,
		Path:      track.Path,
		ArtistID:  track.ArtistId,
		AlbumID:   track.AlbumId,
		Disc:      &track.Disc,
		Number:    &track.Number,
		Duration:  &track.Duration,
		Cover:     &track.CoverId,
		DateAdded: &track.DateAdded,
	}
}

func convertVariable(variable business.InternalVariable) model.Variable {
	return model.Variable{
		Key:   &variable.Key,
		Value: &variable.Value,
	}
}
