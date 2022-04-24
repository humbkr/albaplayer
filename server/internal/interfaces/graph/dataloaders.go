package graph

import (
	"context"
	"fmt"
	"github.com/graph-gophers/dataloader"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/model"
	"net/http"
	"strconv"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// LibraryReader reads entities from the library
type LibraryReader struct {
	libraryInteractor *business.LibraryInteractor
}

// Loaders wrap data loaders to inject via middleware
type Loaders struct {
	ArtistLoader *dataloader.Loader
	AlbumLoader  *dataloader.Loader
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(libInteractor *business.LibraryInteractor) *Loaders {
	// define the data loader
	libraryReader := &LibraryReader{libraryInteractor: libInteractor}
	loaders := &Loaders{
		ArtistLoader: dataloader.NewBatchedLoader(libraryReader.GetArtists),
		AlbumLoader:  dataloader.NewBatchedLoader(libraryReader.GetAlbums),
	}

	return loaders
}

// Middleware injects data loaders into the context
func Middleware(loaders *Loaders, next http.Handler) http.Handler {
	// Return a middleware that injects the loader to the request context
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// GetArtists implements a batch function that can retrieve many artists by ID,
// for use in a dataloader
func (u *LibraryReader) GetArtists(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	// Collect the keys to search for
	entityIDs := make([]int, len(keys))
	for index, key := range keys {
		keyAsInt, _ := strconv.Atoi(key.String())
		entityIDs[index] = keyAsInt
	}
	// Search for those entities
	dbRecords, err := u.libraryInteractor.ArtistRepository.GetMultiple(entityIDs, false)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	// Convert db entities to graph entities and put them into a map by ID
	entitiesById := map[int]*model.Artist{}
	for _, record := range dbRecords {
		graphArtist := convertArtist(record)
		entitiesById[graphArtist.ID] = &graphArtist
	}

	// Construct an output array of dataloader results
	results := make([]*dataloader.Result, len(keys))
	for index, entityKey := range keys {
		keyAsInt, _ := strconv.Atoi(entityKey.String())
		entity, ok := entitiesById[keyAsInt]
		if ok {
			results[index] = &dataloader.Result{Data: entity, Error: nil}
		} else {
			err := fmt.Errorf("no artist")
			if entityKey.String() != "0" {
				err = fmt.Errorf("artist not found %s", entityKey.String())
			}
			results[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return results
}

// GetArtist wraps the artist dataloader for efficient retrieval by artist ID
func GetArtist(ctx context.Context, artistId int) (*model.Artist, error) {
	loaders := For(ctx)
	thunk := loaders.ArtistLoader.Load(ctx, dataloader.StringKey(strconv.Itoa(artistId)))
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*model.Artist), nil
}

// GetAlbums implements a batch function that can retrieve many albums by ID,
// for use in a dataloader
func (u *LibraryReader) GetAlbums(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	// Collect the keys to search for
	entityIDs := make([]int, len(keys))
	for index, key := range keys {
		keyAsInt, _ := strconv.Atoi(key.String())
		entityIDs[index] = keyAsInt
	}
	// Search for those entities
	dbRecords, err := u.libraryInteractor.AlbumRepository.GetMultiple(entityIDs, false)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	// Convert db entities to graph entities and put them into a map by ID
	entitiesById := map[int]*model.Album{}
	for _, record := range dbRecords {
		graphAlbum := convertAlbum(record)
		entitiesById[graphAlbum.ID] = &graphAlbum
	}

	// Construct an output array of dataloader results
	results := make([]*dataloader.Result, len(keys))
	for index, entityKey := range keys {
		keyAsInt, _ := strconv.Atoi(entityKey.String())
		entity, ok := entitiesById[keyAsInt]
		if ok {
			results[index] = &dataloader.Result{Data: entity, Error: nil}
		} else {
			err := fmt.Errorf("no album")
			if entityKey.String() != "0" {
				err = fmt.Errorf("album not found %s", entityKey.String())
			}
			results[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return results

}

// GetAlbum wraps the album dataloader for efficient retrieval by album ID
func GetAlbum(ctx context.Context, albumId int) (*model.Album, error) {
	loaders := For(ctx)
	thunk := loaders.AlbumLoader.Load(ctx, dataloader.StringKey(strconv.Itoa(albumId)))
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*model.Album), nil
}
