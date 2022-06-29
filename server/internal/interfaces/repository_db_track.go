package interfaces

import (
	"database/sql"
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/domain"
)

type TrackDbRepository struct {
	AppContext *AppContext
}

const selectTrackQuery = "SELECT id, title, album_id, artist_id, cover_id, disc, number, duration, genre, path, created_at FROM tracks"
const updateTrackQuery = "UPDATE tracks SET title = ?, album_id = ?, artist_id = ?, cover_id = ?, disc = ?, number = ?, duration = ?, genre = ?, path = ? WHERE id = ?"
const insertTrackQuery = "INSERT INTO tracks(title, album_id, artist_id, cover_id, disc, number, duration, genre, path, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

// Get fetches a track from the database.
func (tr TrackDbRepository) Get(id int) (entity domain.Track, err error) {
	query := selectTrackQuery + " WHERE id = ?"
	rows, err := tr.AppContext.DB.Query(query, id)
	entities, err := processTrackRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no track found")
	}

	entity = entities[0]

	return
}

// GetAll fetches all tracks from the database.
func (tr TrackDbRepository) GetAll() (entities []domain.Track, err error) {
	rows, err := tr.AppContext.DB.Query(selectTrackQuery)
	return processTrackRows(rows, err)
}

func (tr TrackDbRepository) GetMultiple(ids []int) (entities []domain.Track, err error) {
	rows, err := tr.AppContext.DB.Query(selectTrackQuery + " WHERE id IN (" + IntArrayToString(ids, ",") + ")")
	return processTrackRows(rows, err)
}

// GetByName fetches a track from database by name, artist id, and album id.
// If several tracks are found, returns only the first one.
func (tr TrackDbRepository) GetByName(name string, artistId int, albumId int) (entity domain.Track, err error) {
	query := selectTrackQuery + " WHERE title = ? AND artist_id = ? AND album_id = ?"
	rows, err := tr.AppContext.DB.Query(query, name, artistId, albumId)
	entities, err := processTrackRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no track found")
	}

	entity = entities[0]

	return
}

// GetTracksForAlbum fetches tracks having the specified albumId from database ordered by disc number then track number.
func (tr TrackDbRepository) GetTracksForAlbum(albumId int) (entities []domain.Track, err error) {
	rows, err := tr.AppContext.DB.Query(selectTrackQuery+" WHERE album_id = ? ORDER BY disc, number", albumId)
	return processTrackRows(rows, err)
}

// Save creates or updates a track in the Database.
func (tr TrackDbRepository) Save(entity *domain.Track) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = tr.AppContext.DB.Prepare(updateTrackQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(
			entity.Title,
			entity.AlbumId,
			entity.ArtistId,
			entity.CoverId,
			entity.Disc,
			entity.Number,
			entity.Duration,
			entity.Genre,
			entity.Path,
			entity.Id,
		)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = tr.AppContext.DB.Prepare(insertTrackQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(
			entity.Title,
			entity.AlbumId,
			entity.ArtistId,
			entity.CoverId,
			entity.Disc,
			entity.Number,
			entity.Duration,
			entity.Genre,
			entity.Path,
			entity.DateAdded,
		)
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

// Exists check if a track exists for a given id.
func (tr TrackDbRepository) Exists(id int) bool {
	_, err := tr.Get(id)
	return err == nil
}

// Delete deletes a track from the Database.
func (tr TrackDbRepository) Delete(entity *domain.Track) (err error) {
	_, err = tr.AppContext.DB.Exec("DELETE FROM tracks WHERE id = ?", entity.Id)
	return
}

// Count counts the number of entities in datasource.
func (tr TrackDbRepository) Count() (count int, err error) {
	err = tr.AppContext.DB.QueryRow("SELECT COUNT(*) FROM tracks").Scan(&count)
	return
}

// Transactional functions

// getTrackByPathTransaction fetches a track from the database using a transaction.
func getTrackByPathTransaction(dbTransaction *sql.Tx, path string) (entity domain.Track, err error) {
	query := selectTrackQuery + " WHERE path = ?"
	rows, err := dbTransaction.Query(query, path)
	entities, err := processTrackRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no track found")
	}

	entity = entities[0]

	return
}

// saveTrackTransaction creates or updates a track in the Database using a transaction.
func saveTrackTransaction(dbTransaction *sql.Tx, entity *domain.Track) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = dbTransaction.Prepare(updateTrackQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(
			entity.Title,
			entity.AlbumId,
			entity.ArtistId,
			entity.CoverId,
			entity.Disc,
			entity.Number,
			entity.Duration,
			entity.Genre,
			entity.Path,
			entity.Id,
		)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = dbTransaction.Prepare(insertTrackQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(
			entity.Title,
			entity.AlbumId,
			entity.ArtistId,
			entity.CoverId,
			entity.Disc,
			entity.Number,
			entity.Duration,
			entity.Genre,
			entity.Path,
			entity.DateAdded,
		)
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

// Utilities

func processTrackRows(rows *sql.Rows, error error) (entities []domain.Track, err error) {
	if error != nil {
		return entities, error
	}

	for rows.Next() {
		var track domain.Track

		err = rows.Scan(
			&track.Id,
			&track.Title,
			&track.AlbumId,
			&track.ArtistId,
			&track.CoverId,
			&track.Disc,
			&track.Number,
			&track.Duration,
			&track.Genre,
			&track.Path,
			&track.DateAdded,
		)
		if err != nil {
			return
		}

		entities = append(entities, track)
	}

	return
}
