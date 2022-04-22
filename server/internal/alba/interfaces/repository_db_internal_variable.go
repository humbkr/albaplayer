package interfaces

import (
	"errors"
	"github.com/humbkr/albaplayer/internal/alba/business"
)

type InternalVariableDbRepository struct {
	AppContext *AppContext
}

// Get fetches a variable from the database.
func (ivr InternalVariableDbRepository) Get(key string) (variable business.InternalVariable, err error) {
	object, err := ivr.AppContext.DB.Get(business.InternalVariable{}, key)
	if err == nil && object != nil {
		variable = *object.(*business.InternalVariable)
	} else {
		err = errors.New("no variable found for this key")
	}

	return
}

// Save creates or update a variable in the Database.
func (ivr InternalVariableDbRepository) Save(variable *business.InternalVariable) (err error) {
	if variable.Key == "" {
		err = errors.New("cannot insert a variable with no key")
		return
	} else if ivr.Exists(variable.Key) {
		// Update entity.
		_, err = ivr.AppContext.DB.Update(variable)
		return
	} else {
		// Insert new entity.
		err = ivr.AppContext.DB.Insert(variable)
		return
	}
}

// Delete deletes a variable from the Database.
func (ivr InternalVariableDbRepository) Delete(variable *business.InternalVariable) (err error) {
	_, err = ivr.AppContext.DB.Delete(variable)

	return
}

// Exists checks if a variable exists for a given key.
func (ivr InternalVariableDbRepository) Exists(key string) bool {
	_, err := ivr.Get(key)
	return err == nil
}
