package domain

type Track struct {
	Id        int    `db:"id"` // Id used to get resources.
	Title     string `db:"title"` // Mandatory.
	AlbumId   int    `db:"album_id"`
	ArtistId  int    `db:"artist_id"`
	CoverId   int    `db:"cover_id"`
	Disc      string `db:"disc"`
	Number    int    `db:"number"`
	Duration  int    `db:"duration"` // Duration in seconds.
	Genre	  string `db:"genre"` // TODO externalize this in another table.
	Path      string `db:"path"` // Mandatory.
	DateAdded int64  `db:"created_at"`
}
