package interfaces

import (
	"database/sql"
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
)

type ArtistDbRepository struct {
	AppContext *AppContext
}

const selectArtistQuery = "SELECT id, name, created_at FROM artists"
const updateArtistQuery = "UPDATE artists SET name = ? WHERE id = ?"
const insertArtistQuery = "INSERT INTO artists(name, created_at) VALUES(?, ?)"

// Get fetches an artist from the database.
// Param hydrate: if true populate artist albums and tracks.
func (ar ArtistDbRepository) Get(id int, hydrate bool) (entity domain.Artist, err error) {
	query := selectArtistQuery + " WHERE id = ?"
	rows, err := ar.AppContext.DB.Query(query, id)
	entities, err := processArtistRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no artist found")
	}

	entity = entities[0]

	if hydrate {
		ar.populateAlbums(&entity, hydrate)
	}

	return
}

// GetAll fetches all artists from the database.
// Param hydrate: if true populate artist albums and tracks. WARNING: huge performance impact.
func (ar ArtistDbRepository) GetAll(hydrate bool) (entities []domain.Artist, err error) {
	rows, err := ar.AppContext.DB.Query(selectArtistQuery)
	entities, err = processArtistRows(rows, err)
	if err != nil {
		return
	}

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
	query := selectArtistQuery + " WHERE id IN (" + IntArrayToString(ids, ",") + ")"
	rows, err := ar.AppContext.DB.Query(query)
	entities, err = processArtistRows(rows, err)
	if err != nil {
		return
	}

	if hydrate {
		for i := range entities {
			ar.populateAlbums(&entities[i], hydrate)
		}
	}

	return
}

// GetByName fetches an artist from database based on its name (case-insensitive).
func (ar ArtistDbRepository) GetByName(name string) (entity domain.Artist, err error) {
	query := selectArtistQuery + " WHERE name = ?"
	rows, err := ar.AppContext.DB.Query(query, name)
	entities, err := processArtistRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no artist found")
	}

	entity = entities[0]

	return
}

// Save creates or updates an artist in the Database.
func (ar ArtistDbRepository) Save(entity *domain.Artist) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = ar.AppContext.DB.Prepare(updateArtistQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Name, entity.Id)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = ar.AppContext.DB.Prepare(insertArtistQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Name, entity.DateAdded)
		if err != nil {
			return err
		}

		// Get generated entity id.
		lastId, err := res.LastInsertId()
		if err != nil {
			return err
		}

		entity.Id = int(lastId)
	}

	return
}

// Delete deletes an artist from the Database.
func (ar ArtistDbRepository) Delete(entity *domain.Artist) (err error) {
	// Delete all albums and tracks.
	if len(entity.Albums) == 0 {
		ar.populateAlbums(entity, true)
	}
	albumRepo := AlbumDbRepository{AppContext: ar.AppContext}
	for i := range entity.Albums {
		_ = albumRepo.Delete(&entity.Albums[i])
	}

	// Then delete artist.
	_, err = ar.AppContext.DB.Exec("DELETE FROM artists WHERE id = ?", entity.Id)

	return
}

// Exists check if an artist exists for a given id.
func (ar ArtistDbRepository) Exists(id int) bool {
	_, err := ar.Get(id, false)
	return err == nil
}

// Count counts the number of entities in datasource.
func (ar ArtistDbRepository) Count() (count int, err error) {
	err = ar.AppContext.DB.QueryRow("SELECT COUNT(*) FROM artists").Scan(&count)
	return
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

// Transactional functions

// getArtistByNameTransaction fetches an artist from the database using a transaction.
func getArtistByNameTransaction(dbTransaction *sql.Tx, name string) (entity domain.Artist, err error) {
	query := selectArtistQuery + " WHERE name = ?"
	rows, err := dbTransaction.Query(query, name)
	entities, err := processArtistRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no artist found")
	}

	entity = entities[0]

	return
}

// saveArtistTransaction creates or updates an artist in the Database using a transaction.
func saveArtistTransaction(dbTransaction *sql.Tx, entity *domain.Artist) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = dbTransaction.Prepare(updateArtistQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Name, entity.Id)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = dbTransaction.Prepare(insertArtistQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Name, entity.DateAdded)
		if err != nil {
			return err
		}

		// Get generated entity id.
		lastId, err := res.LastInsertId()
		if err != nil {
			return err
		}

		entity.Id = int(lastId)
	}

	return
}

// Utilities.

func processArtistRows(rows *sql.Rows, error error) (entities []domain.Artist, err error) {
	if error != nil {
		return entities, error
	}

	for rows.Next() {
		var artist domain.Artist

		err = rows.Scan(
			&artist.Id,
			&artist.Name,
			&artist.DateAdded,
		)
		if err != nil {
			return
		}

		entities = append(entities, artist)
	}

	return
}
