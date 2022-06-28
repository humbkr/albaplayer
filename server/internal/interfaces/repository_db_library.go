package interfaces

type LibraryDbRepository struct {
	AppContext *AppContext
}

// Erase erases all library data.
func (lr LibraryDbRepository) Erase() error {
	// We have to delete the tables content AND reset the sequences for ID columns.
	_, err := lr.AppContext.DB.Exec("DELETE FROM covers")
	_, err = lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'covers'")
	_, err = lr.AppContext.DB.Exec("DELETE FROM tracks")
	_, err = lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'tracks'")
	_, err = lr.AppContext.DB.Exec("DELETE FROM albums")
	_, err = lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'albums'")
	_, err = lr.AppContext.DB.Exec("DELETE FROM artists")
	_, err = lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'artists'")

	return err
}
