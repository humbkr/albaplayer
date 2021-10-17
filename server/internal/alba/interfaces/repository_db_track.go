package interfaces

import (
	"errors"
	"time"

	"github.com/humbkr/albaplayer-server/internal/alba/domain"
)

type TrackDbRepository struct {
	AppContext *AppContext
}

/*
Fetches a track from the database.
*/
func (tr TrackDbRepository) Get(id int) (entity domain.Track, err error) {
	object, err := tr.AppContext.DB.Get(domain.Track{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Track)
	} else {
		err = errors.New("no track found")
	}

	return
}

/*
Fetches all tracks from the database.
*/
func (tr TrackDbRepository) GetAll() (entities domain.Tracks, err error) {
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks")

	return
}

/**
Fetches a track from database by name, artist id, and album id.

If several tracks are found, returns only the first one.
*/
func (tr TrackDbRepository) GetByName(name string, artistId int, albumId int) (entity domain.Track, err error) {
	var entities domain.Tracks
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks WHERE title = ? AND artist_id = ? AND album_id = ?", name, artistId, albumId)

	if err == nil {
		if len(entities) > 0 {
			entity = entities[0]
		} else {
			err = errors.New("No result found")
		}
	}

	return
}

/**
Fetches tracks having the specified albumId from database ordered by disc number then track number.
*/
func (tr TrackDbRepository) GetTracksForAlbum(albumId int) (entities domain.Tracks, err error) {
	_, err = tr.AppContext.DB.Select(&entities, "SELECT * FROM tracks WHERE album_id = ? ORDER BY disc, number", albumId)

	return
}

/**
Create or update a track in the Database.
*/
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

// Check if a track exists for a given id.
func (tr TrackDbRepository) Exists(id int) bool {
	_, err := tr.Get(id)
	return err == nil
}

/**
Delete a track from the Database.
*/
func (tr TrackDbRepository) Delete(entity *domain.Track) (err error) {
	_, err = tr.AppContext.DB.Delete(entity)
	return
}
