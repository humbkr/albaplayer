package business

import "github.com/humbkr/albaplayer-server/internal/alba/domain"

type ArtistRepository interface {
	// Gets an entity from the datasource.
	//
	// Returns an hydrated entity if entity is found, else an error.
	Get(id int) (entity domain.Artist, err error)

	// Gets all entities from the datasource.
	//
	// If no entities found, returns an empty collection without error.
	GetAll(hydrate bool) (entities domain.Artists, err error)

	// Gets an entity based on its name.
	GetByName(name string) (entity domain.Artist, err error)

	// Saves an entity to a datasource.
	Save(entity *domain.Artist) (err error)

	// Deletes an entity from a datasource.
	//
	// Does not return an error if the entity doesn't exists on the datasource or no entity id is given.
	Delete(entity *domain.Artist) (err error)

	// Tests if an entity exists in datasource.
	Exists(id int) bool

	// Removes artists without tracks drom DB.
	CleanUp() error
}

type AlbumRepository interface {
	// Gets an entity from a datasource.
	//
	// Returns an hydrated entity if entity is fund, else an error.
	Get(id int) (entity domain.Album, err error)

	// Gets all entities from the datasource.
	//
	// If no entities found, returns an empty collection without error.
	GetAll(hydrate bool) (entities domain.Albums, err error)

	// Gets an entity based on its name.
	GetByName(name string, artistId int) (entity domain.Album, err error)

	// Gets all albums for a given artist.
	//
	// If hydrate == true, hydrate the sub objects. If no album found, returns an empty collection without error.
	GetAlbumsForArtist(artistId int, hydrate bool) (entities domain.Albums, err error)

	// Saves an entity to a datasource.
	Save(entity *domain.Album) (err error)

	// Deletes an entity from a datasource.
	//
	// Does not return an error if the entity doesn't exists on the datasource or no entity id is given.
	Delete(entity *domain.Album) (err error)

	// Tests if an entity exists in datasource.
	Exists(id int) bool

	// Removes albums without tracks drom DB
	CleanUp() error
}

type TrackRepository interface {
	// Gets an entity from a datasource.
	//
	// Returns an hydrated entity if entity is fund, else an error.
	Get(id int) (entity domain.Track, err error)

	// Gets all entities from the datasource.
	//
	// If no entities found, returns an empty collection without error.
	GetAll() (entities domain.Tracks, err error)

	// Gets an entity based on its name.
	GetByName(name string, artistId int, albumId int) (entity domain.Track, err error)

	// Gets all tracks for a given album.
	//
	// If hydrate == true, hydrate the sub objects. If no track found, returns an empty collection without error.
	GetTracksForAlbum(albumId int) (entities domain.Tracks, err error)

	// Saves an entity to a datasource.
	Save(entity *domain.Track) (err error)

	// Deletes an entity from a datasource.
	//
	// Does not return an error if the entity doesn't exists on the datasource or no entity id is given.
	Delete(entity *domain.Track) (err error)

	// Tests if an entity exists in datasource.
	Exists(id int) bool
}

type CoverRepository interface {
	// Gets an entity from a datasource.
	//
	// Returns an hydrated entity if entity is fund, else an error.
	Get(id int) (entity domain.Cover, err error)

	// Saves an entity to a datasource.
	Save(entity *domain.Cover) (err error)

	// Deletes an entity from a datasource.
	//
	// Does not return an error if the entity doesn't exists on the datasource or no entity id is given.
	Delete(entity *domain.Cover) (err error)

	// Tests if an entity exists in datasource.
	Exists(id int) bool

	// Checks if a entity exists or not by hash.
	//
	// Returns cover.Id if exists, else 0.
	ExistsByHash(hash string) int
}

type InternalVariableRepository interface {
	// Gets an entity from a datasource.
	//
	// Returns an hydrated entity if entity is fund, else an error.
	Get(key string) (entity InternalVariable, err error)

	// Saves an entity to a datasource.
	Save(entity *InternalVariable) (err error)

	// Deletes an entity from a datasource.
	//
	// Does not return an error if the entity doesn't exists on the datasource or no entity id is given.
	Delete(entity *InternalVariable) (err error)

	// Tests if an entity exists in datasource.
	Exists(key string) bool
}

type LibraryRepository interface {
	Erase()
}

// Interface describing the storage mecanism for media.
type MediaFileRepository interface {
	// TODO Not abstract enough yet, we should not need a path but a reader or something.
	ScanMediaFiles(path string) (int, int, error)
	MediaFileExists(filepath string) bool
	WriteCoverFile(file *domain.Cover, directory string) error
	RemoveCoverFile(file *domain.Cover, directory string) error
	DeleteCovers() error
}
