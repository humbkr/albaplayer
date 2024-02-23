package model

type Collection struct {
	ID        int     `json:"id"`
	UserId    int     `json:"userId"`
	Type      string  `json:"type"`
	Title     string  `json:"title"`
	Items     *string `json:"items"`
	DateAdded *int64  `json:"dateAdded"`
}
