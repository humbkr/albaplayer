package business

type User struct {
	Id            int    `db:"id" json:"id"`
	Name          string `db:"name" json:"name"`
	Email         string `db:"email" json:"email"`
	Password      string `db:"password" json:"-"`
	Data          string `db:"config" json:"data"`
	DateAdded     int64  `db:"created_at" json:"dateAdded"`
	Roles         []Role `db:"-" json:"roles"`
	IsDefaultUser bool   `db:"-" json:"isDefaultUser"`
}

type Role string

const (
	ROLE_OWNER    Role = "owner"
	ROLE_ADMIN    Role = "admin"
	ROLE_LISTENER Role = "listener"
)

func GetRoleAsString(role Role) string {
	switch role {
	case ROLE_OWNER:
		return "owner"
	case ROLE_ADMIN:
		return "admin"
	case ROLE_LISTENER:
		return "listener"
	}

	return "listener"
}

func GetRoleFromString(role string) Role {
	switch role {
	case "owner":
		return ROLE_OWNER
	case "admin":
		return ROLE_ADMIN
	case "listener":
		return ROLE_LISTENER
	}

	return ROLE_LISTENER
}
