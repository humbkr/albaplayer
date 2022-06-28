package domain

type Cover struct {
	Id   int     	`db:"id"`
	Path string  	`db:"path"` // Mandatory.
	Hash string  	`db:"hash"` // Mandatory.
	// TODO maybe use another higher level object for the following.
	Ext string	 	`db:"-"`
	Content []byte 	`db:"-"`
}
