package datasources

import (
	"database/sql"
	"embed"
	"log"

	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

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

	// Validate SQLite database integrity
	if dbDriver == "sqlite3" {
		row := db.QueryRow("PRAGMA quick_check;")
		var result string
		if err = row.Scan(&result); err != nil {
			log.Println("ERROR: failed to run database integrity check", err)
			return
		}
		if result != "ok" {
			log.Printf("ERROR: database integrity check failed: %s\n", result)
			return
		}
		log.Println("Database integrity check passed")
	}

	// Use go:embed for migrations
	migrations := &migrate.EmbedFileSystemMigrationSource{
		FileSystem: migrationsFS,
		Root:       "migrations",
	}

	log.Println(migrations.FindMigrations())

	n, err := migrate.Exec(db, "sqlite3", migrations, migrate.Up)
	if err != nil {
		log.Println("WARNING: unable to apply migrations")
		log.Println(err)
	}
	log.Printf("Applied %d migrations\n", n)

	return db, nil
}
