package interfaces

import (
	"database/sql"
	"errors"
	"github.com/humbkr/albaplayer/internal/domain"
)

type CoverDbRepository struct {
	AppContext *AppContext
}

const selectCoverQuery = "SELECT id, path, hash FROM covers"
const updateCoverQuery = "UPDATE covers SET path = ?, hash = ? WHERE id = ?"
const insertCoverQuery = "INSERT INTO covers(path, hash) VALUES(?, ?)"

// Get fetches a cover from the database.
func (ar CoverDbRepository) Get(id int) (entity domain.Cover, err error) {
	query := selectCoverQuery + " WHERE id = ?"
	rows, err := ar.AppContext.DB.Query(query, id)
	entities, err := processCoverRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no cover found")
	}

	entity = entities[0]

	return
}

// Save creates or updates a cover in the Database.
func (ar CoverDbRepository) Save(entity *domain.Cover) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = ar.AppContext.DB.Prepare(updateCoverQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Path, entity.Hash, entity.Id)
	} else {
		// Insert new entity.
		stmt, err = ar.AppContext.DB.Prepare(insertCoverQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Path, entity.Hash)
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

// Delete deletes a cover from the Database.
func (ar CoverDbRepository) Delete(entity *domain.Cover) (err error) {
	_, err = ar.AppContext.DB.Exec("DELETE FROM covers WHERE id = ?", entity.Id)

	return
}

// Exists checks if a cover exists for a given id.
func (ar CoverDbRepository) Exists(id int) bool {
	_, err := ar.Get(id)
	return err == nil
}

// ExistsByHash checks if a cover exists or not by hash.
// Returns cover.Id if exists, else 0.
func (ar CoverDbRepository) ExistsByHash(hash string) (id int) {
	err := ar.AppContext.DB.
		QueryRow("SELECT id FROM covers WHERE hash = ?", hash).
		Scan(&id)
	if err != nil {
		return 0
	}

	return
}

// Transactional functions

// getCoverByNameTransaction fetches a cover from the database using a transaction.
func getCoverByNameTransaction(dbTransaction *sql.Tx, hash string) (entity domain.Cover, err error) {
	query := selectCoverQuery + " WHERE hash = ?"
	rows, err := dbTransaction.Query(query, hash)
	entities, err := processCoverRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no cover found")
	}

	entity = entities[0]

	return
}

// saveCoverTransaction creates or updates a cover in the Database using a transaction.
func saveCoverTransaction(dbTransaction *sql.Tx, entity *domain.Cover) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = dbTransaction.Prepare(updateCoverQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Path, entity.Hash, entity.Id)
	} else {
		// Insert new entity.
		stmt, err = dbTransaction.Prepare(insertCoverQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Path, entity.Hash)
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

func processCoverRows(rows *sql.Rows, error error) (entities []domain.Cover, err error) {
	if error != nil {
		return entities, error
	}

	for rows.Next() {
		var cover domain.Cover

		err = rows.Scan(
			&cover.Id,
			&cover.Path,
			&cover.Hash,
		)
		if err != nil {
			return
		}

		entities = append(entities, cover)
	}

	return
}
