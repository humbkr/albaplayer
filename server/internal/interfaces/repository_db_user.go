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

const selectUserQuery = "SELECT u.id, u.name, u.email, u.password, u.config, u.created_at, ur.role_name AS role " +
	"FROM users u " +
	"JOIN users_roles ur ON u.id = ur.user_id"
const updateUserQuery = "UPDATE users SET name = ?, email = ?, password = ?, config = ? WHERE id = ?"
const insertUserQuery = "INSERT INTO users(name, email, password, config, created_at) VALUES(?, ?, ?, ?, ?)"

// Get fetches a user from the database.
func (r UserDbRepository) Get(id int) (entity business.User, err error) {
	query := selectUserQuery + " WHERE u.id = ?"
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
		dbTransaction, _ := r.AppContext.DB.Begin()

		// Reset all the users roles.
		_, err = dbTransaction.Exec("DELETE FROM users_roles WHERE user_id = ?", entity.Id)
		if err != nil {
			dbTransaction.Rollback()
			return
		}

		// Update user.
		stmt, err = dbTransaction.Prepare(updateUserQuery)
		if err != nil {
			dbTransaction.Rollback()
			return
		}

		_, err = stmt.Exec(entity.Name, entity.Email, entity.Password, entity.Data, entity.Id)
		if err != nil {
			dbTransaction.Rollback()
			return
		}

		// Update roles.
		for _, v := range entity.Roles {
			_, err = dbTransaction.Exec("INSERT INTO users_roles(user_id, role_name) VALUES(?, ?)", entity.Id, v)
			if err != nil {
				dbTransaction.Rollback()
				return
			}
		}

		dbTransaction.Commit()
	} else {
		// Insert new entity.
		dbTransaction, _ := r.AppContext.DB.Begin()

		// Create user.
		entity.DateAdded = time.Now().Unix()
		stmt, err = dbTransaction.Prepare(insertUserQuery)
		if err != nil {
			dbTransaction.Rollback()
			return
		}

		res, err := stmt.Exec(entity.Name, entity.Email, entity.Password, entity.Data, entity.DateAdded)
		if err != nil {
			dbTransaction.Rollback()
			return err
		}

		// Get generated entity id.
		lastId, err := res.LastInsertId()
		if err != nil {
			dbTransaction.Rollback()
			return err
		}

		// Add user roles.
		for _, v := range entity.Roles {
			_, err = dbTransaction.Exec("INSERT INTO users_roles(user_id, role_name) VALUES(?, ?)", lastId, v)
			if err != nil {
				dbTransaction.Rollback()
				return err
			}
		}

		dbTransaction.Commit()
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

// GetFromUsername retrieves a user entity using its username (for authentication purpose).
func (r UserDbRepository) GetFromUsername(username string) (entity business.User, err error) {
	query := selectUserQuery + " WHERE u.name = ?"
	rows, err := r.AppContext.DB.Query(query, username)
	entities, err := processUserRows(rows, err)
	if err != nil || len(entities) == 0 {
		return entity, errors.New("invalid credentials")
	}

	entity = entities[0]

	return
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
			&entity.Data,
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
	if currentEntity.Id != 0 {
		entities = append(entities, currentEntity)
	}

	return
}
