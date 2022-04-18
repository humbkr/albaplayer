package business

import "github.com/humbkr/albaplayer/internal/alba/domain"

type ArtistRepository interface {
	// Get retrieves an entity from the datasource.
	// Returns entity if entity is found, else an error.
	// Param hydrate: if true also fetch the artist's albums.
	Get(id int, hydrate bool) (entity domain.Artist, err error)

	// GetAll retrieves all entities from the datasource.
	// If no entities found, returns an empty collection without error.
	// Param hydrate: if true also fetch the artist's albums.
	GetAll(hydrate bool) (entities []domain.Artist, err error)

	// GetMultiple retrieves some entities from the datasource.
	// Param hydrate: if true also fetch the artist's albums.
	GetMultiple(ids []int, hydrate bool) (entities []domain.Artist, err error)

	// GetByName retrieves an entity based on its name.
	GetByName(name string) (entity domain.Artist, err error)

	// Save saves an entity to a datasource.
	Save(entity *domain.Artist) (err error)

	// Delete deletes an entity from a datasource.
	// Does not return an error if the entity doesn't exist on the datasource or no entity id is given.
	Delete(entity *domain.Artist) (err error)

	// Exists tests if an entity exists in datasource.
	Exists(id int) bool

	// Count counts the number of entities in datasource.
	Count() (count int, err error)

	// CleanUp removes artists without tracks from DB.
	CleanUp() error
}

type AlbumRepository interface {
	// Get retrieves an entity from a datasource.
	// Returns a hydrated entity if entity is fund, else an error.
	// Param hydrate: if true also fetch the album's tracks.
	Get(id int, hydrate bool) (entity domain.Album, err error)

	// GetAll retrieves all entities from the datasource.
	// If no entities found, returns an empty collection without error.
	// Param hydrate: if true also fetch the album's tracks.
	GetAll(hydrate bool) (entities []domain.Album, err error)

	// GetMultiple retrieves some entities from the datasource.
	// Param hydrate: if true also fetch the artist's albums.
	GetMultiple(ids []int, hydrate bool) (entities []domain.Album, err error)

	// GetByName retrieves an entity based on its name.
	GetByName(name string, artistId int) (entity domain.Album, err error)

	// GetAlbumsForArtist retrieves all albums for a given artist.
	// If hydrate == true, hydrate the sub objects. If no album found, returns an empty collection without error.
	GetAlbumsForArtist(artistId int, hydrate bool) (entities []domain.Album, err error)

	// Save saves an entity to a datasource.
	Save(entity *domain.Album) (err error)

	// Delete deletes an entity from a datasource.
	// Does not return an error if the entity doesn't exist on the datasource or no entity id is given.
	Delete(entity *domain.Album) (err error)

	// Exists tests if an entity exists in datasource.
	Exists(id int) bool

	// Count counts the number of entities in datasource.
	Count() (count int, err error)

	// CleanUp removes albums without tracks drom DB
	CleanUp() error
}

type TrackRepository interface {
	// Get retrieves an entity from a datasource.
	Get(id int) (entity domain.Track, err error)

	// GetAll retrieves all entities from the datasource.
	// If no entities found, returns an empty collection without error.
	GetAll() (entities []domain.Track, err error)

	// GetMultiple retrieves some entities from the datasource.
	// Param hydrate: if true also fetch the artist's albums.
	GetMultiple(ids []int) (entities []domain.Track, err error)

	// GetByName retrieves an entity based on its name.
	GetByName(name string, artistId int, albumId int) (entity domain.Track, err error)

	// GetTracksForAlbum retrieves all tracks for a given album.
	GetTracksForAlbum(albumId int) (entities []domain.Track, err error)

	// Save saves an entity to a datasource.
	Save(entity *domain.Track) (err error)

	// Delete deletes an entity from a datasource.
	// Does not return an error if the entity doesn't exist on the datasource or no entity id is given.
	Delete(entity *domain.Track) (err error)

	// Exists tests if an entity exists in datasource.
	Exists(id int) bool

	// Count counts the number of entities in datasource.
	Count() (count int, err error)
}

type CoverRepository interface {
	// Get retrieves an entity from a datasource.
	Get(id int) (entity domain.Cover, err error)

	// Save saves an entity to a datasource.
	Save(entity *domain.Cover) (err error)

	// Delete deletes an entity from a datasource.
	// Does not return an error if the entity doesn't exist on the datasource or no entity id is given.
	Delete(entity *domain.Cover) (err error)

	// Exists tests if an entity exists in datasource.
	Exists(id int) bool

	// ExistsByHash Checks if a entity exists or not by hash.
	// Returns cover.Id if exists, else 0.
	ExistsByHash(hash string) int
}

type InternalVariableRepository interface {
	// Get retrieves an entity from a datasource.
	Get(key string) (entity InternalVariable, err error)

	// Save saves an entity to a datasource.
	Save(entity *InternalVariable) (err error)

	// Delete deletes an entity from a datasource.
	// Does not return an error if the entity doesn't exist on the datasource or no entity id is given.
	Delete(entity *InternalVariable) (err error)

	// Exists tests if an entity exists in datasource.
	Exists(key string) bool
}

type LibraryRepository interface {
	Erase()
}

// MediaFileRepository is an interface describing the storage mechanism for media.
type MediaFileRepository interface {
	// TODO Not abstract enough yet, we should not need a path but a reader or something.
	ScanMediaFiles(path string) (int, int, error)
	MediaFileExists(filepath string) bool
	WriteCoverFile(file *domain.Cover, directory string) error
	RemoveCoverFile(file *domain.Cover, directory string) error
	DeleteCovers() error
}
