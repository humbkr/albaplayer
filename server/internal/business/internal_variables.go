package business

import (
	"errors"
)

type InternalVariableInteractor struct {
	InternalVariableRepository InternalVariableRepository
}

// GetInternalVariable returns an internal variable by key.
// If no user found, returns an error.
func (interactor *InternalVariableInteractor) GetInternalVariable(key string) (InternalVariable, error) {
	return interactor.InternalVariableRepository.Get(key)
}

// SaveInternalVariable saves an internal variable.
// Returns an error if a mandatory property is empty.
func (interactor *InternalVariableInteractor) SaveInternalVariable(entity *InternalVariable) error {
	// Check that all required info is present.
	if entity.Key == "" {
		return errors.New("cannot save variable: empty key")
	}

	return interactor.InternalVariableRepository.Save(entity)
}

// DeleteInternalVariable deletes an internal variable.
// Returns an error if no key provided.
func (interactor *InternalVariableInteractor) DeleteInternalVariable(entity *InternalVariable) error {
	if entity.Key == "" {
		return errors.New("cannot delete variable: key not provided")
	}

	return interactor.InternalVariableRepository.Delete(entity)
}

// InternalVariableExists checks if a user exists or not.
func (interactor *InternalVariableInteractor) InternalVariableExists(key string) bool {
	return interactor.InternalVariableRepository.Exists(key)
}
