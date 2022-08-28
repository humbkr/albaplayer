package business

import (
	"errors"
)

type UsersInteractor struct {
	UserRepository UserRepository
}

// GetUser gets a user by id.
// If no user found, returns an error.
func (interactor *UsersInteractor) GetUser(id int) (User, error) {
	return interactor.UserRepository.Get(id)
}

// GetAllUsers gets all users.
// If no users found, returns an empty collection.
func (interactor *UsersInteractor) GetAllUsers() ([]User, error) {
	return interactor.UserRepository.GetAll()
}

// SaveUser saves a use.
// Returns an error if a mandatory property is empty.
func (interactor *UsersInteractor) SaveUser(entity *User) error {
	if entity.Name == "" {
		return errors.New("cannot save user: empty name")
	}
	if entity.Email == "" {
		return errors.New("cannot save user: empty email")
	}
	if entity.Password == "" {
		return errors.New("cannot save user: empty password")
	}
	if len(entity.Roles) < 1 {
		return errors.New("cannot save user: no associated role")
	}

	return interactor.UserRepository.Save(entity)
}

// DeleteUser deletes a user.
// Returns an error if no user id provided.
// User with role owner cannot be deleted.
func (interactor *UsersInteractor) DeleteUser(entity *User) error {
	if entity.Id == 0 {
		return errors.New("cannot delete user: id not provided")
	}

	// TODO: implement this later when we have the current user requesting the action.
	//canUserBeDeleted, errPermissions := canDeleteUser(User{}, *entity)
	//if !canUserBeDeleted {
	//	return errPermissions
	//}

	return interactor.UserRepository.Delete(entity)
}

// UserExists checks if a user exists or not.
func (interactor *UsersInteractor) UserExists(entityId int) bool {
	return interactor.UserRepository.Exists(entityId)
}

// UserLogin retrieves a user entity using its username and hashed password.
func (interactor *UsersInteractor) UserLogin(username string, password string) (User, error) {
	return interactor.UserRepository.Login(username, password)
}

// canDeleteUser checks if a user has the permissions to delete another one.
func canDeleteUser(actionOriginUser User, userToBeDeleted User) (bool, error) {
	// If we cannot check permissions, abort.
	if len(userToBeDeleted.Roles) < 1 {
		return false, errors.New("cannot check user to be deleted roles")
	}
	// TODO: implement this later.
	//if len(actionOriginUser.Roles) < 1 {
	//	return false, errors.New("cannot check action user roles")
	//}
	//if len(userToBeDeleted.Roles) < 1 {
	//	return false, errors.New("cannot check user to be deleted roles")
	//}

	// Check permissions.
	if userHasRole(userToBeDeleted, ROLE_OWNER) {
		return false, errors.New("cannot delete a user with the role 'owner'")
	}
	if userHasRole(userToBeDeleted, ROLE_ADMIN) && !userHasRole(actionOriginUser, ROLE_ADMIN) {
		return false, errors.New("only a user with the 'admin' role can delete another 'admin'")
	}

	return true, nil
}

// userHasRole checks if a user has a specific role.
func userHasRole(user User, roleName Role) bool {
	for _, value := range user.Roles {
		if value == roleName {
			return true
		}
	}

	return false
}
