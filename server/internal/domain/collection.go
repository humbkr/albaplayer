package domain

type Collection struct {
	Id     int    `db:"id"`      // Mandatory.
	UserId int    `db:"user_id"` // Mandatory.
	Type   string `db:"type"`    // Mandatory, albums | tracks.
	Title  string `db:"title"`
	Items  string `db:"items"` // Json array of track + position.
	Date   int64  `db:"created_at"`
}
