package interfaces

import (
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
	"errors"
)

type CoverDbRepository struct {
	AppContext *AppContext
}

/*
Fetches a cover from the database.
*/
func (ar CoverDbRepository) Get(id int) (entity domain.Cover, err error) {
	object, err := ar.AppContext.DB.Get(domain.Cover{}, id)
	if err == nil && object != nil {
		entity = *object.(*domain.Cover)
	} else {
		err = errors.New("no cover found")
	}

	return
}

/**
Create or update a cover in the Database.
*/
func (ar CoverDbRepository) Save(entity *domain.Cover) (err error) {
	if entity.Id != 0 {
		// Update.
		_, err = ar.AppContext.DB.Update(entity)
		return
	} else {
		// Insert new entity.
		err = ar.AppContext.DB.Insert(entity)
		return
	}
}


// Deletes a cover from the Database.
func (ar CoverDbRepository) Delete(entity *domain.Cover) (err error) {
	_, err = ar.AppContext.DB.Delete(entity)

	return
}

// Checks if a cover exists for a given id.
func (ar CoverDbRepository) Exists(id int) bool {
	_, err := ar.Get(id)
	return err == nil
}

/*
Checks if a cover exists or not by hash.

Returns cover.Id if exists, else 0.
 */
func (ar CoverDbRepository) ExistsByHash(hash string) int {
	var entity domain.Cover
	err := ar.AppContext.DB.SelectOne(&entity, "SELECT * FROM covers WHERE hash = ?", hash)
	if err == nil {
		return entity.Id
	}

	return 0
}
