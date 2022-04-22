package interfaces

import (
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/alba/domain"
)

type TrackDbRepository struct {
	AppContext *AppContext
}

// Get fetches a track from the database.
func (tr TrackDbRepository) Get(id int) (entity domain.Track, err error) {
	object, err := tr.AppContext.DB.Get(domain.Track{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Track)
	} else {
		err = errors.New("no track found")
	}

	return
}

// GetAll fetches all tracks from the database.
func (tr TrackDbRepository) GetAll() (entities []domain.Track, err error) {
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks")

	return
}

func (tr TrackDbRepository) GetMultiple(ids []int) (entities []domain.Track, err error) {
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * "+
		"FROM tracks "+
		"WHERE id IN ("+IntArrayToString(ids, ",")+")")

	return
}

// GetByName fetches a track from database by name, artist id, and album id.
// If several tracks are found, returns only the first one.
func (tr TrackDbRepository) GetByName(name string, artistId int, albumId int) (entity domain.Track, err error) {
	var entities []domain.Track
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks WHERE title = ? AND artist_id = ? AND album_id = ?", name, artistId, albumId)

	if err == nil {
		if len(entities) > 0 {
			entity = entities[0]
		} else {
			err = errors.New("no result found")
		}
	}

	return
}

// GetTracksForAlbum fetches tracks having the specified albumId from database ordered by disc number then track number.
func (tr TrackDbRepository) GetTracksForAlbum(albumId int) (entities []domain.Track, err error) {
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks WHERE album_id = ? ORDER BY disc, number", albumId)

	return
}

// Save creates or updates a track in the Database.
func (tr TrackDbRepository) Save(entity *domain.Track) (err error) {
	if entity.Id != 0 {
		// Update.
		_, err = tr.AppContext.DB.Update(entity)
		return
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		err = tr.AppContext.DB.Insert(entity)
		return
	}
}

// Exists check if a track exists for a given id.
func (tr TrackDbRepository) Exists(id int) bool {
	_, err := tr.Get(id)
	return err == nil
}

// Delete deletes a track from the Database.
func (tr TrackDbRepository) Delete(entity *domain.Track) (err error) {
	_, err = tr.AppContext.DB.Delete(entity)
	return
}

// Count counts the number of entities in datasource.
func (tr TrackDbRepository) Count() (count int, err error) {
	type Count struct {
		Count int
	}

	rows, err := tr.AppContext.DB.Select(Count{}, "SELECT count(*) as Count FROM tracks")
	countEntities := rows[0].(*Count)

	return countEntities.Count, err
}
