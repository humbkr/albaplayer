package model

type Artist struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	AlbumsID  []*string `json:"albums"`
	DateAdded *int64    `json:"dateAdded"`
}
