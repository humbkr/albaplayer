package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strconv"

	"github.com/humbkr/albaplayer/internal/interfaces/graph/generated"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/model"
)

func (r *albumResolver) Artist(ctx context.Context, obj *model.Album) (*model.Artist, error) {
	// Do not search for artist if album has no artist.
	if obj.ArtistID == 0 {
		return nil, nil
	}

	return GetArtist(ctx, obj.ArtistID)
}

func (r *albumResolver) Cover(ctx context.Context, obj *model.Album) (*string, error) {
	coverEndpoint := "/covers/" + strconv.Itoa(*obj.Cover)
	return &coverEndpoint, nil
}

func (r *albumResolver) Tracks(ctx context.Context, obj *model.Album) ([]*model.Track, error) {
	var result []*model.Track
	tracks, err := r.Library.TrackRepository.GetTracksForAlbum(obj.ID)

	if err == nil {
		for _, track := range tracks {
			gqlTrack := convertTrack(track)
			result = append(result, &gqlTrack)
		}
	}

	return result, err
}

func (r *artistResolver) Albums(ctx context.Context, obj *model.Artist) ([]*model.Album, error) {
	var result []*model.Album
	albums, err := r.Library.AlbumRepository.GetAlbumsForArtist(obj.ID, false)

	if err == nil {
		for _, album := range albums {
			gqlAlbum := convertAlbum(album)
			result = append(result, &gqlAlbum)
		}
	}

	return result, err
}

func (r *mutationResolver) UpdateLibrary(ctx context.Context) (*model.LibraryUpdateState, error) {
	if r.Library.LibraryIsUpdating {
		return nil, fmt.Errorf("library currently updating")
	}

	r.Library.UpdateLibrary()

	countArtists, _ := r.Library.ArtistRepository.Count()
	countAlbums, _ := r.Library.AlbumRepository.Count()
	countTracks, _ := r.Library.TrackRepository.Count()

	updateLibraryState := model.LibraryUpdateState{
		TracksNumber:  &countTracks,
		AlbumsNumber:  &countAlbums,
		ArtistsNumber: &countArtists,
	}

	return &updateLibraryState, nil
}

func (r *mutationResolver) EraseLibrary(ctx context.Context) (*model.LibraryUpdateState, error) {
	if r.Library.LibraryIsUpdating {
		return nil, fmt.Errorf("library currently updating")
	}

	r.Library.EraseLibrary()

	countArtists, _ := r.Library.ArtistRepository.Count()
	countAlbums, _ := r.Library.AlbumRepository.Count()
	countTracks, _ := r.Library.TrackRepository.Count()

	updateLibraryState := model.LibraryUpdateState{
		TracksNumber:  &countTracks,
		AlbumsNumber:  &countAlbums,
		ArtistsNumber: &countArtists,
	}

	return &updateLibraryState, nil
}

func (r *queryResolver) Album(ctx context.Context, id int) (*model.Album, error) {
	return GetAlbum(ctx, id)
}

func (r *queryResolver) Albums(ctx context.Context) ([]*model.Album, error) {
	var result []*model.Album
	albums, err := r.Library.AlbumRepository.GetAll(false)

	if err == nil {
		for _, album := range albums {
			gqlAlbum := convertAlbum(album)
			result = append(result, &gqlAlbum)
		}
	}

	return result, err
}

func (r *queryResolver) Artist(ctx context.Context, id int) (*model.Artist, error) {
	return GetArtist(ctx, id)
}

func (r *queryResolver) Artists(ctx context.Context) ([]*model.Artist, error) {
	var result []*model.Artist
	artists, err := r.Library.ArtistRepository.GetAll(false)

	if err == nil {
		for _, artist := range artists {
			gqlArtist := convertArtist(artist)
			result = append(result, &gqlArtist)
		}
	}

	return result, err
}

func (r *queryResolver) Track(ctx context.Context, id int) (*model.Track, error) {
	var result model.Track
	track, err := r.Library.TrackRepository.Get(id)

	if err == nil {
		result = convertTrack(track)
	}

	return &result, err
}

func (r *queryResolver) Tracks(ctx context.Context) ([]*model.Track, error) {
	var result []*model.Track
	tracks, err := r.Library.TrackRepository.GetAll()

	if err == nil {
		for _, track := range tracks {
			gqlTrack := convertTrack(track)
			result = append(result, &gqlTrack)
		}
	}

	return result, err
}

func (r *queryResolver) Settings(ctx context.Context) (*model.Settings, error) {
	settings := r.ClientSettings.GetSettings()

	return &model.Settings{
		LibraryPath:            &settings.LibraryPath,
		CoversPreferredSource:  &settings.CoversPreferredSource,
		DisableLibrarySettings: &settings.DisableLibraryConfiguration,
		Version:                &r.Version,
	}, nil
}

func (r *queryResolver) Variable(ctx context.Context, key string) (*model.Variable, error) {
	var result model.Variable
	variable, err := r.Library.InternalVariableRepository.Get(key)

	if err == nil {
		result = convertVariable(variable)
	}

	return &result, err
}

func (r *trackResolver) Src(ctx context.Context, obj *model.Track) (string, error) {
	return "/stream/" + strconv.Itoa(obj.ID), nil
}

func (r *trackResolver) Artist(ctx context.Context, obj *model.Track) (*model.Artist, error) {
	// Do not search for artist if track has no artist.
	if obj.ArtistID == 0 {
		return nil, nil
	}

	return GetArtist(ctx, obj.ArtistID)
}

func (r *trackResolver) Album(ctx context.Context, obj *model.Track) (*model.Album, error) {
	// Do not search for album if track has no album.
	if obj.AlbumID == 0 {
		return nil, nil
	}

	return GetAlbum(ctx, obj.AlbumID)
}

func (r *trackResolver) Cover(ctx context.Context, obj *model.Track) (*string, error) {
	coverEndpoint := "/covers/" + strconv.Itoa(*obj.Cover)
	return &coverEndpoint, nil
}

// Album returns generated.AlbumResolver implementation.
func (r *Resolver) Album() generated.AlbumResolver { return &albumResolver{r} }

// Artist returns generated.ArtistResolver implementation.
func (r *Resolver) Artist() generated.ArtistResolver { return &artistResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Track returns generated.TrackResolver implementation.
func (r *Resolver) Track() generated.TrackResolver { return &trackResolver{r} }

type albumResolver struct{ *Resolver }
type artistResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type trackResolver struct{ *Resolver }
