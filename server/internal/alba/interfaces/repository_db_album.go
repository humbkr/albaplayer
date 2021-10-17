package interfaces

import (
	"errors"
	"time"

	"github.com/humbkr/albaplayer-server/internal/alba/domain"
)

type AlbumDbRepository struct {
	AppContext *AppContext
}

/*
Fetches an album from the database.
*/
func (ar AlbumDbRepository) Get(id int) (entity domain.Album, err error) {
	object, err := ar.AppContext.DB.Get(domain.Album{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Album)
		ar.populateTracks(&entity)
	} else {
		err = errors.New("no album found")
	}

	return
}

/*
Fetches all albums from the database.

@param hydrate
	If true populate albums tracks. WARNING: VERY time consuming
*/
func (ar AlbumDbRepository) GetAll(hydrate bool) (entities domain.Albums, err error) {
	if !hydrate {
		query := "SELECT id, title, year, artist_id, cover_id, created_at FROM albums"
		_, err = ar.AppContext.DB.Select(&entities, query)

	} else {
		type gorpResult struct {
			AlbumId int
			AlbumTitle string
			AlbumYear string
			AlbumArtistId int
			AlbumCreatedAt int64
			domain.Track
			// Cannot select domain.album.ArtistId or domain.track.AlbumId because of a Gorp error...
			// So we have to join on trk.album_id, but then Gorp cannot do the mapping with gorpResult, so we have
			// to add this property in the struct. TODO get rid of gorp.
			Album_id int
		}
		var results []gorpResult

		query := "SELECT alb.Id AlbumId, alb.Title AlbumTitle, alb.Year AlbumYear, alb.artist_id AlbumArtistId, alb.created_at AlbumCreatedAt, trk.* " +
			     "FROM albums alb, tracks trk WHERE alb.id = trk.album_id"

		_, err = ar.AppContext.DB.Select(&results, query)
		if err == nil {
			// Deduplicate stuff.
			var current domain.Album
			for _, r := range results {
				track := domain.Track{
					Id: r.Id,
					Title: r.Title,
					AlbumId: r.AlbumId,
					ArtistId: r.ArtistId,
					CoverId: r.CoverId,
					Disc: r.Disc,
					Number: r.Number,
					Duration: r.Duration,
					Genre: r.Genre,
					Path: r.Path,
					DateAdded: r.DateAdded,
				}

				if current.Id == 0 {
					current = domain.Album{
						Id: r.AlbumId,
						Title: r.AlbumTitle,
						Year: r.AlbumYear,
						ArtistId: r.AlbumArtistId,
						DateAdded: r.AlbumCreatedAt,
					}
				} else if r.Id != current.Id {
					entities = append(entities, current)
					// Then change the current album
					current = domain.Album{
						Id: r.AlbumId,
						Title: r.AlbumTitle,
						Year: r.AlbumYear,
						ArtistId: r.AlbumArtistId,
						DateAdded: r.AlbumCreatedAt,
					}
				}
				current.Tracks = append(current.Tracks, track)
			}
		}
	}

	return
}

/*
Fetches an album from database.
*/
func (ar AlbumDbRepository) GetByName(name string, artistId int) (entity domain.Album, err error) {
	var entities domain.Albums
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * FROM albums WHERE title = ? AND artist_id = ?", name, artistId)

	if err == nil {
		if len(entities) > 0 {
			entity = entities[0]
		} else {
			err = errors.New("no result found")
		}
	}

	return
}

/*
Fetches albums having the specified artistId from database ordered by year.
*/
func (ar AlbumDbRepository) GetAlbumsForArtist(artistId int, hydrate bool) (entities domain.Albums, err error) {
	_, err = ar.AppContext.DB.Select(&entities, "SELECT * FROM albums WHERE artist_id = ? ORDER BY year", artistId)
	if err == nil && hydrate {
		for i := range entities {
			ar.populateTracks(&entities[i])
		}
	}

	return
}

/*
Create or update an album in the Database.
*/
func (ar AlbumDbRepository) Save(entity *domain.Album) (err error) {
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

/*
Delete an album from the Database.
*/
func (ar AlbumDbRepository) Delete(entity *domain.Album) (err error) {
	// Delete all tracks.
	if len(entity.Tracks) == 0 {
		ar.populateTracks(entity)
	}
	tracksRepo := TrackDbRepository{AppContext: ar.AppContext}
	for i := range entity.Tracks {
		tracksRepo.Delete(&entity.Tracks[i])
	}

	// Then delete album.
	_, err = ar.AppContext.DB.Delete(entity)
	return
}

// Check if an album exists for a given id.
func (ar AlbumDbRepository) Exists(id int) bool {
	_, err := ar.Get(id)
	return err == nil
}

// Removes artists without tracks drom DB.
func (ar AlbumDbRepository) CleanUp() error {
	_, err := ar.AppContext.DB.Exec("DELETE FROM albums WHERE NOT EXISTS (SELECT id FROM tracks WHERE tracks.album_id = albums.id)")
	return err
}

/**
Helper function to populate tracks.
 */
func (ar AlbumDbRepository) populateTracks(album *domain.Album) {
	tracksRepo := TrackDbRepository{AppContext: ar.AppContext}
	if tracks, err := tracksRepo.GetTracksForAlbum(album.Id); err == nil {
		album.Tracks = tracks
	}
}
