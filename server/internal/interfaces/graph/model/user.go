package model

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     *string   `json:"email"`
	Password  *string   `json:"password"`
	DateAdded *int64    `json:"dateAdded"`
	Roles     []*string `json:"roles"`
}
