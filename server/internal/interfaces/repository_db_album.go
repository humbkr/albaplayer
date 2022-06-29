package interfaces

import (
	"database/sql"
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/domain"
)

type AlbumDbRepository struct {
	AppContext *AppContext
}

const selectAlbumQuery = "SELECT id, title, year, artist_id, cover_id, created_at FROM albums"
const updateAlbumQuery = "UPDATE albums SET title = ?, year = ?, artist_id = ?, cover_id = ? WHERE id = ?"
const insertAlbumQuery = "INSERT INTO albums(title, year, artist_id, cover_id, created_at) VALUES(?, ?, ?, ?, ?)"

// Get fetches an album from the database.
func (ar AlbumDbRepository) Get(id int, hydrate bool) (entity domain.Album, err error) {
	query := selectAlbumQuery + " WHERE id = ?"
	rows, err := ar.AppContext.DB.Query(query, id)
	entities, err := processAlbumRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no album found")
	}

	entity = entities[0]

	if hydrate {
		ar.populateTracks(&entity)
	}

	return
}

// GetAll fetches all albums from the database.
// Param hydrate: if true populate albums' tracks. WARNING: huge performance impact.
func (ar AlbumDbRepository) GetAll(hydrate bool) (entities []domain.Album, err error) {
	var query string
	if !hydrate {
		rows, err := ar.AppContext.DB.Query(selectAlbumQuery)
		return processAlbumRows(rows, err)

	} else {
		query = "SELECT alb.id as AlbumId, alb.title as AlbumTitle, alb.year as AlbumYear, alb.artist_id as AlbumArtistId, alb.cover_id as AlbumCoverId, alb.created_at as AlbumCreatedAt, " +
			"trk.id as TrackId, trk.title as TrackTitle, trk.album_id as TrackAlbumId, trk.artist_id as TrackArtistId, trk.cover_id as TrackCoverId, trk.disc as TrackDisc, trk.number as TrackNumber, trk.duration as TrackDuration, trk.genre as TrackGenre, trk.path as TrackPath " +
			"FROM albums alb, tracks trk " +
			"WHERE alb.id = trk.album_id"
		rows, err := ar.AppContext.DB.Query(query)
		return processAlbumRowsHydrated(rows, err)
	}
}

// GetMultiple fetches multiple albums from the database.
func (ar AlbumDbRepository) GetMultiple(ids []int, hydrate bool) (entities []domain.Album, err error) {
	if !hydrate {
		query := selectAlbumQuery + " WHERE id IN (" + IntArrayToString(ids, ",") + ")"
		rows, err := ar.AppContext.DB.Query(query)
		return processAlbumRows(rows, err)

	} else {
		query := "SELECT alb.Id AlbumId, alb.Title AlbumTitle, alb.Year AlbumYear, alb.artist_id AlbumArtistId, alb.cover_id as AlbumCoverId, alb.created_at AlbumCreatedAt, " +
			"trk.id as TrackId, trk.title as TrackTitle, trk.album_id as TrackAlbumId, trk.artist_id as TrackArtistId, trk.cover_id as TrackCoverId, trk.disc as TrackDisc, trk.number as TrackNumber, trk.duration as TrackDuration, trk.genre as TrackGenre, trk.path as TrackPath " +
			"FROM albums alb, tracks trk " +
			"WHERE alb.id = trk.album_id " +
			"AND alb.id IN (?)"
		rows, err := ar.AppContext.DB.Query(query, IntArrayToString(ids, ","))
		return processAlbumRowsHydrated(rows, err)
	}
}

// GetByName fetches an album from database from its name.
func (ar AlbumDbRepository) GetByName(name string, artistId int) (entity domain.Album, err error) {
	query := selectAlbumQuery + " WHERE title = ? AND artist_id = ?"
	rows, err := ar.AppContext.DB.Query(query, name, artistId)
	entities, err := processAlbumRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no album found")
	}

	entity = entities[0]

	return
}

// GetAlbumsForArtist fetches albums having the specified artistId from database ordered by year.
func (ar AlbumDbRepository) GetAlbumsForArtist(artistId int, hydrate bool) (entities []domain.Album, err error) {
	rows, err := ar.AppContext.DB.Query(selectAlbumQuery+" WHERE artist_id = ? ORDER BY year", artistId)
	entities, err = processAlbumRows(rows, err)
	if err != nil {
		return
	}

	if hydrate {
		for i := range entities {
			ar.populateTracks(&entities[i])
		}
	}

	return
}

// Save creates or updates an album in the Database.
func (ar AlbumDbRepository) Save(entity *domain.Album) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = ar.AppContext.DB.Prepare(updateAlbumQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.Id)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = ar.AppContext.DB.Prepare(insertAlbumQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.DateAdded)
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

// Delete deletes an album from the Database.
func (ar AlbumDbRepository) Delete(entity *domain.Album) (err error) {
	// Delete all tracks.
	if len(entity.Tracks) == 0 {
		ar.populateTracks(entity)
	}
	tracksRepo := TrackDbRepository{AppContext: ar.AppContext}
	for i := range entity.Tracks {
		err := tracksRepo.Delete(&entity.Tracks[i])
		if err != nil {
			return err
		}
	}

	// Then delete album.
	_, err = ar.AppContext.DB.Exec("DELETE FROM albums WHERE id = ?", entity.Id)
	return
}

// Exists check if an album exists for a given id.
func (ar AlbumDbRepository) Exists(id int) bool {
	_, err := ar.Get(id, false)
	return err == nil
}

// Count counts the number of entities in datasource.
func (ar AlbumDbRepository) Count() (count int, err error) {
	err = ar.AppContext.DB.QueryRow("SELECT COUNT(*) FROM albums").Scan(&count)
	return
}

// CleanUp removes artists without tracks from DB.
func (ar AlbumDbRepository) CleanUp() error {
	_, err := ar.AppContext.DB.Exec("DELETE FROM albums WHERE NOT EXISTS (SELECT id FROM tracks WHERE tracks.album_id = albums.id)")
	return err
}

// populateTracks is a helper function to populate tracks.
func (ar AlbumDbRepository) populateTracks(album *domain.Album) {
	tracksRepo := TrackDbRepository{AppContext: ar.AppContext}
	if tracks, err := tracksRepo.GetTracksForAlbum(album.Id); err == nil {
		album.Tracks = tracks
	}
}

// Transactional functions

// getAlbumByNameAndArtistTransaction fetches an album from the database using a transaction.
func getAlbumByNameAndArtistTransaction(dbTransaction *sql.Tx, name string, artistId int) (entity domain.Album, err error) {
	query := selectAlbumQuery + " WHERE title = ? AND artist_id = ?"
	rows, err := dbTransaction.Query(query, name, artistId)
	entities, err := processAlbumRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no album found")
	}

	entity = entities[0]

	return
}

// saveAlbumTransaction creates or updates an album in the Database using a transaction.
func saveAlbumTransaction(dbTransaction *sql.Tx, entity *domain.Album) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = dbTransaction.Prepare(updateAlbumQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.Id)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = dbTransaction.Prepare(insertAlbumQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Title, entity.Year, entity.ArtistId, entity.CoverId, entity.DateAdded)
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

func processAlbumRows(rows *sql.Rows, error error) (entities []domain.Album, err error) {
	if error != nil {
		return entities, error
	}

	for rows.Next() {
		var album domain.Album

		err = rows.Scan(
			&album.Id,
			&album.Title,
			&album.Year,
			&album.ArtistId,
			&album.CoverId,
			&album.DateAdded,
		)
		if err != nil {
			return
		}

		entities = append(entities, album)
	}

	return
}

func processAlbumRowsHydrated(rows *sql.Rows, error error) (entities []domain.Album, err error) {
	if error != nil {
		return entities, error
	}

	var currentAlbum domain.Album
	for rows.Next() {
		var album domain.Album
		var track domain.Track

		err = rows.Scan(
			&album.Id,
			&album.Title,
			&album.Year,
			&album.ArtistId,
			&album.CoverId,
			&album.DateAdded,
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
		)
		if err != nil {
			return
		}

		if currentAlbum.Id == 0 {
			// If first album, set current album.
			currentAlbum = album
		} else if currentAlbum.Id != album.Id {
			// If new album, add current album to the final results and change current album.
			entities = append(entities, currentAlbum)
			currentAlbum = album
		}

		currentAlbum.Tracks = append(currentAlbum.Tracks, track)
	}

	// Add last processed album.
	entities = append(entities, currentAlbum)

	return
}
