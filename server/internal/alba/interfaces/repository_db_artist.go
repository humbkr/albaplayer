package interfaces

import (
	"errors"
	"time"

	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
)

type ArtistDbRepository struct {
	AppContext *AppContext
}

/*
Fetches an artist from the database.
*/
func (ar ArtistDbRepository) Get(id int) (entity domain.Artist, err error) {
	object, err := ar.AppContext.DB.Get(domain.Artist{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Artist)
		ar.populateAlbums(&entity, true)
	} else {
		err = errors.New("no artist found")
	}

	return
}

/*
Fetches all artists from the database.

@param hydrate
	If true populate albums tracks.
*/
func (ar ArtistDbRepository) GetAll(hydrate bool) (entities domain.Artists, err error) {
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * FROM artists")
	if hydrate {
		for i := range entities {
			ar.populateAlbums(&entities[i], hydrate)
		}
	}

	return
}

/**
Fetches an artist from database based on its name (case insensitive).
*/
func (ar ArtistDbRepository) GetByName(name string) (entity domain.Artist, err error) {
	var entities domain.Artists
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * FROM artists WHERE name = ?", name)

	if err == nil {
		if len(entities) > 0 {
			entity = entities[0]
		} else {
			err = errors.New("no result found")
		}
	}

	return
}

/**
Create or update an artist in the Database.
*/
func (ar ArtistDbRepository) Save(entity *domain.Artist) (err error) {
	if entity.Id != 0 {
		// Update.
		_, err = ar.AppContext.DB.Update(entity)
		return
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		err = ar.AppContext.DB.Insert(entity)
		return
	}
}

/**
Delete an artist from the Database.
*/
func (ar ArtistDbRepository) Delete(entity *domain.Artist) (err error) {
	// Delete all albums.
	if len(entity.Albums) == 0 {
		ar.populateAlbums(entity, false)
	}
	albumRepo := AlbumDbRepository{AppContext: ar.AppContext}
	for i := range entity.Albums {
		_ = albumRepo.Delete(&entity.Albums[i])
	}

	// Then delete album.
	_, err = ar.AppContext.DB.Delete(entity)

	return
}

// Check if an artist exists for a given id.
func (ar ArtistDbRepository) Exists(id int) bool {
	_, err := ar.Get(id)
	return err == nil
}

// Removes artists without tracks drom DB.
func (ar ArtistDbRepository) CleanUp() error {
	_, err := ar.AppContext.DB.Exec("DELETE FROM artists WHERE NOT EXISTS (SELECT id FROM tracks WHERE tracks.artist_id = artists.id) AND artists.name != ?", business.LibraryDefaultCompilationArtist)
	return err
}


/**
Helper function to populate albums.
 */
func (ar ArtistDbRepository) populateAlbums(artist *domain.Artist, hydrate bool) {
	albumRepo := AlbumDbRepository{AppContext: ar.AppContext}
	if albums, err := albumRepo.GetAlbumsForArtist(artist.Id, hydrate); err == nil {
		artist.Albums = albums
	}
}
