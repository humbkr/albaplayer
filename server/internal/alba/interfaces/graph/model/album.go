package model

type Album struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Year      *string   `json:"year"`
	ArtistID  int       `json:"artist"`
	Cover     *int      `json:"cover"`
	TracksID  []*int    `json:"tracks"`
	DateAdded *int64    `json:"dateAdded"`
}
