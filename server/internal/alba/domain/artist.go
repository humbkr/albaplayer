package domain

type Artist struct {
	Id   	  int     `db:"id"`
	Name 	  string  `db:"name"` // Mandatory.
	DateAdded int64   `db:"created_at"`
	Albums 	  Albums  `db:"-"`
}

type Artists []Artist
