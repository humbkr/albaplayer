package interfaces

import (
	"errors"
	"github.com/humbkr/albaplayer/internal/business"
)

type InternalVariableDbRepository struct {
	AppContext *AppContext
}

// Get fetches a variable from the database.
func (ivr InternalVariableDbRepository) Get(key string) (entity business.InternalVariable, err error) {
	err = ivr.AppContext.DB.
		QueryRow("SELECT key, value FROM variables WHERE key = ?", key).
		Scan(&entity.Key, &entity.Value)

	return
}

// Save creates or update a variable in the Database.
func (ivr InternalVariableDbRepository) Save(entity *business.InternalVariable) (err error) {
	if entity.Key == "" {
		err = errors.New("cannot insert a variable with no key")
	} else if ivr.Exists(entity.Key) {
		// Update entity.
		stmt, err := ivr.AppContext.DB.Prepare("UPDATE variables SET value = ? WHERE key = ?")
		if err != nil {
			return err
		}

		_, err = stmt.Exec(entity.Value, entity.Key)
		if err != nil {
			return err
		}
	} else {
		// Insert new entity.
		stmt, err := ivr.AppContext.DB.Prepare("INSERT INTO variables(key, value) " +
			"VALUES(?, ?)")
		if err != nil {
			return err
		}

		_, err = stmt.Exec(entity.Key, entity.Value)
		if err != nil {
			return err
		}
	}

	return
}

// Delete deletes a variable from the Database.
func (ivr InternalVariableDbRepository) Delete(entity *business.InternalVariable) (err error) {
	_, err = ivr.AppContext.DB.Exec("DELETE FROM variables WHERE key = ?", entity.Key)

	return
}

// Exists checks if a variable exists for a given key.
func (ivr InternalVariableDbRepository) Exists(key string) bool {
	_, err := ivr.Get(key)
	return err == nil
}
