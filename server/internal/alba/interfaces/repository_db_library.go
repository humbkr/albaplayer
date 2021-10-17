package interfaces

type LibraryDbRepository struct {
	AppContext *AppContext
}

/*
Erase all collection data.
*/
func (lr LibraryDbRepository) Erase() {
	// We have to delete the tables content AND reset the sequences for ID columns.
	lr.AppContext.DB.Exec("DELETE FROM covers")
	lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'covers'")
	lr.AppContext.DB.Exec("DELETE FROM tracks")
	lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'tracks'")
	lr.AppContext.DB.Exec("DELETE FROM albums")
	lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'albums'")
	lr.AppContext.DB.Exec("DELETE FROM artists")
	lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'artists'")
	lr.AppContext.DB.Exec("DELETE FROM variables")
	lr.AppContext.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'variables'")
}
