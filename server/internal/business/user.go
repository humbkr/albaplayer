package business

type User struct {
	Id        int    `db:"id"`
	Name      string `db:"name"`
	Email     string `db:"email"`
	Password  string `db:"password"`
	DateAdded int64  `db:"created_at"`
	Roles     []Role `db:"-"`
}

type Role string

const (
	ROLE_OWNER    Role = "owner"
	ROLE_ADMIN    Role = "admin"
	ROLE_LISTENER Role = "listener"
)
