package model

type Track struct {
	ID        int     `json:"id"`
	Title     string  `json:"title"`
	Path      string  `json:"src"`
	ArtistID  int     `json:"artist"`
	AlbumID   int     `json:"album"`
	Disc      *string `json:"disc"`
	Number    *int    `json:"number"`
	Duration  *int    `json:"duration"`
	Cover     *int    `json:"cover"`
	DateAdded *int64  `json:"dateAdded"`
}
