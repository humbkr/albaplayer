package domain

type Cover struct {
	Id      int    `db:"id"`
	Path    string `db:"path"` // Mandatory.
	Hash    string `db:"hash"` // Mandatory.
	Ext     string `db:"-"`
	Content []byte `db:"-"`
}
