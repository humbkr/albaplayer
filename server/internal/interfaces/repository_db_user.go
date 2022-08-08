package interfaces

import (
	"database/sql"
	"errors"
	"github.com/humbkr/albaplayer/internal/business"
	"time"
)

type UserDbRepository struct {
	AppContext *AppContext
}

const selectUserQuery = "SELECT u.id, u.name, u.email, u.password, u.created_at, r.name AS role " +
	"FROM users u " +
	"JOIN users_roles ur ON u.id = ur.user_id " +
	"JOIN roles r ON ur.role_id = r.id"
const updateUserQuery = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?"
const insertUserQuery = "INSERT INTO users(name, email, password, created_at) VALUES(?, ?, ?, ?)"

// Get fetches a user from the database.
func (r UserDbRepository) Get(id int) (entity business.User, err error) {
	query := selectUserQuery + " WHERE id = ?"
	rows, err := r.AppContext.DB.Query(query, id)
	entities, err := processUserRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("no user found")
	}

	entity = entities[0]

	return
}

// GetAll fetches all users from the database.
func (r UserDbRepository) GetAll() (entities []business.User, err error) {
	rows, err := r.AppContext.DB.Query(selectUserQuery)
	entities, err = processUserRows(rows, err)
	if err != nil {
		return
	}

	return
}

// Save creates or updates a user in the Database.
func (r UserDbRepository) Save(entity *business.User) (err error) {
	var stmt *sql.Stmt

	if entity.Id != 0 {
		// Update.
		stmt, err = r.AppContext.DB.Prepare(updateUserQuery)
		if err != nil {
			return
		}

		_, err = stmt.Exec(entity.Name, entity.Email, entity.Password, entity.Id)
	} else {
		// Insert new entity.
		entity.DateAdded = time.Now().Unix()
		stmt, err = r.AppContext.DB.Prepare(insertUserQuery)
		if err != nil {
			return
		}

		res, err := stmt.Exec(entity.Name, entity.Email, entity.Password, entity.DateAdded)
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

// Delete deletes a user from the Database.
func (r UserDbRepository) Delete(entity *business.User) (err error) {
	// Delete roles associated to the user.
	_, err = r.AppContext.DB.Exec("DELETE FROM users_roles WHERE user_id = ?", entity.Id)
	if err != nil {
		return err
	}

	// Then delete user.
	_, err = r.AppContext.DB.Exec("DELETE FROM users WHERE id = ?", entity.Id)

	return
}

// Exists check if a user exists for a given id.
func (r UserDbRepository) Exists(id int) bool {
	_, err := r.Get(id)
	return err == nil
}

// Utilities.

func processUserRows(rows *sql.Rows, error error) (entities []business.User, err error) {
	if error != nil {
		return entities, error
	}

	var currentEntity business.User
	for rows.Next() {
		var entity business.User
		var role business.Role

		err = rows.Scan(
			&entity.Id,
			&entity.Name,
			&entity.Email,
			&entity.Password,
			&entity.DateAdded,
			&role,
		)
		if err != nil {
			return
		}

		if currentEntity.Id == 0 {
			// If first entity, set current entity.
			currentEntity = entity
		} else if currentEntity.Id != entity.Id {
			// If new entity, add current entity to the final results and change current entity.
			entities = append(entities, currentEntity)
			currentEntity = entity
		}

		currentEntity.Roles = append(currentEntity.Roles, role)
	}

	// Add last processed album.
	entities = append(entities, currentEntity)

	return
}
