package interfaces

import (
	"database/sql"
	"github.com/markbates/pkger"
	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
	"log"
)

// InitAlbaDatasource initialises the application main datasource.
func InitAlbaDatasource(dbDriver string, dbFile string) (ds *sql.DB, err error) {
	log.Println("Initialising datasource...")
	db, err := sql.Open(dbDriver, dbFile)
	if err != nil {
		log.Println(err)
		return
	}

	// Check database is reachable.
	if err = db.Ping(); err != nil {
		log.Println(err)
		return
	}

	migrations := &migrate.HttpFileSystemMigrationSource{
		FileSystem: pkger.Dir("/migrations"),
	}

	n, err := migrate.Exec(db, "sqlite3", migrations, migrate.Up)
	if err != nil {
		log.Println("WARNING: unable to apply migrations")
		log.Println(err)
	}
	log.Printf("Applied %d migrations\n", n)

	return db, nil
}
