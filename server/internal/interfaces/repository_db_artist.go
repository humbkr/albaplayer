package interfaces

import (
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
)

type ArtistDbRepository struct {
	AppContext *AppContext
}

// Get fetches an artist from the database.
func (ar ArtistDbRepository) Get(id int, hydrate bool) (entity domain.Artist, err error) {
	object, err := ar.AppContext.DB.Get(domain.Artist{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Artist)

		if hydrate {
			ar.populateAlbums(&entity, true)
		}
	} else {
		err = errors.New("no artist found")
	}

	return
}

// GetAll fetches all artists from the database.
// Param hydrate: if true populate albums tracks.
func (ar ArtistDbRepository) GetAll(hydrate bool) (entities []domain.Artist, err error) {
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * FROM artists")

	if hydrate {
		for i := range entities {
			ar.populateAlbums(&entities[i], hydrate)
		}
	}

	return
}

// GetMultiple fetches multiple artists from the database.
// Param hydrate: if true populate albums tracks.
func (ar ArtistDbRepository) GetMultiple(ids []int, hydrate bool) (entities []domain.Artist, err error) {
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * "+
		"FROM artists "+
		"WHERE id IN ("+IntArrayToString(ids, ",")+")")

	if hydrate {
		for i := range entities {
			ar.populateAlbums(&entities[i], hydrate)
		}
	}

	return
}

// GetByName fetches an artist from database based on its name (case-insensitive).
func (ar ArtistDbRepository) GetByName(name string) (entity domain.Artist, err error) {
	var entities []domain.Artist
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

// Save creates or updates an artist in the Database.
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

// Delete deletes an artist from the Database.
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

// Exists check if an artist exists for a given id.
func (ar ArtistDbRepository) Exists(id int) bool {
	_, err := ar.Get(id, false)
	return err == nil
}

// Count counts the number of entities in datasource.
func (ar ArtistDbRepository) Count() (count int, err error) {
	type Count struct {
		Count int
	}

	rows, err := ar.AppContext.DB.Select(Count{}, "SELECT count(*) as Count FROM artists")
	countEntities := rows[0].(*Count)

	return countEntities.Count, err
}

// CleanUp removes artists without tracks from DB.
func (ar ArtistDbRepository) CleanUp() error {
	_, err := ar.AppContext.DB.Exec("DELETE FROM artists WHERE NOT EXISTS (SELECT id FROM tracks WHERE tracks.artist_id = artists.id) AND artists.name != ?", business.LibraryDefaultCompilationArtist)
	return err
}

// populateAlbums is a helper function to populate albums.
func (ar ArtistDbRepository) populateAlbums(artist *domain.Artist, hydrate bool) {
	albumRepo := AlbumDbRepository{AppContext: ar.AppContext}
	if albums, err := albumRepo.GetAlbumsForArtist(artist.Id, hydrate); err == nil {
		artist.Albums = albums
	}
}
