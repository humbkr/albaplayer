package interfaces

import (
	"database/sql"
	"errors"
	"time"

	"github.com/humbkr/albaplayer/internal/domain"
)

type CollectionDbRepository struct {
	AppContext *AppContext
}

const selectCollectionQuery = "SELECT id, user_id, type, title, items, created_at FROM collections"
const updateCollectionQuery = "UPDATE collections SET user_id = ?, type = ?, title = ?, items = ? WHERE id = ?"
const insertCollectionQuery = "INSERT INTO collections(user_id, type, title, items, created_at) VALUES(?, ?, ?, ?, ?)"

// Get fetches a collection from the database.
func (ar CollectionDbRepository) Get(id int) (entity domain.Collection, err error) {
	query := selectCollectionQuery + " WHERE id = ?"
	rows, err := ar.AppContext.DB.Query(query, id)
	entities, err := processCollectionRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no collection found")
	}

	entity = entities[0]

	return
}

// GetAll fetches all collections of a specified type from a specified user from the database.
func (ar CollectionDbRepository) GetAll(collectionType string, userId int) (entities []domain.Collection, err error) {
	rows, err := ar.AppContext.DB.Query(selectCollectionQuery+" WHERE type = ? AND user_id = ?", collectionType, userId)
	return processCollectionRows(rows, err)
}

// GetMultiple fetches multiple collections from the database.
func (ar CollectionDbRepository) GetMultiple(ids []int) (entities []domain.Collection, err error) {
	query := selectCollectionQuery + " WHERE id IN (" + IntArrayToString(ids, ",") + ")"
	rows, err := ar.AppContext.DB.Query(query)
	return processCollectionRows(rows, err)
}

// Save creates or updates a collection in the Database.
func (ar CollectionDbRepository) Save(entity *domain.Collection) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = ar.AppContext.DB.Prepare(updateCollectionQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.UserId, entity.Type, entity.Title, entity.Items, entity.Id)
	} else {
		// Insert new entity.
		entity.Date = time.Now().Unix()
		stmt, err = ar.AppContext.DB.Prepare(insertCollectionQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.UserId, entity.Type, entity.Title, entity.Items, entity.Date)
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

// Delete deletes a collection from the Database.
func (ar CollectionDbRepository) Delete(entity *domain.Collection) (err error) {
	_, err = ar.AppContext.DB.Exec("DELETE FROM collections WHERE id = ?", entity.Id)
	return
}

// Exists check if a collection exists for a given id.
func (ar CollectionDbRepository) Exists(id int) bool {
	_, err := ar.Get(id)
	return err == nil
}

// Utilities.

func processCollectionRows(rows *sql.Rows, error error) (entities []domain.Collection, err error) {
	if error != nil {
		return entities, error
	}

	for rows.Next() {
		var collection domain.Collection

		err = rows.Scan(
			&collection.Id,
			&collection.UserId,
			&collection.Type,
			&collection.Title,
			&collection.Items,
			&collection.Date,
		)
		if err != nil {
			return
		}

		entities = append(entities, collection)
	}

	return
}
