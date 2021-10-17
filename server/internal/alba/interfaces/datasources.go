package interfaces

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-gorp/gorp"
	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
	"github.com/markbates/pkger"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rubenv/sql-migrate"
)

/**
Interface to a datasource to abstract the underlying storage mecanism.
 */
type Datasource interface {
	Exec(query string, args ...interface{}) (sql.Result, error)
	SelectOne(holder interface{}, query string, args ...interface{}) error
	Select(i interface{}, query string, args ...interface{}) ([]interface{}, error)
	Get(i interface{}, keys ...interface{}) (interface{}, error)
	Insert(list ...interface{}) error
	Update(list ...interface{}) (int64, error)
	Delete(list ...interface{}) (int64, error)
}

/**
Initialiase the application main datasource.
 */
func InitAlbaDatasource(dbDriver string, dbFile string) (ds Datasource, err error) {
	connection, err := sql.Open(dbDriver, dbFile)
	if err != nil {
		return
	}

	// Check database is reachable.
	if err = connection.Ping(); err != nil {
		return
	}

	migrations := &migrate.HttpFileSystemMigrationSource{
		FileSystem: pkger.Dir("/migrations"),
	}

	n, err := migrate.Exec(connection, "sqlite3", migrations, migrate.Up)
	if err != nil {
		return
	}
	fmt.Printf("Applied %d migrations!\n", n)

	// Construct a gorp DbMap.
	dbmap := &gorp.DbMap{Db: connection, Dialect: gorp.SqliteDialect{}}

	// Bind tables to objects.
	dbmap.AddTableWithName(domain.Artist{}, "artists").SetKeys(true, "Id").AddIndex("ArtistNameIndex", "nil", []string{"name"})
	dbmap.AddTableWithName(domain.Album{}, "albums").SetKeys(true, "Id").AddIndex("AlbumTitleIndex", "nil", []string{"title"})
	dbmap.AddTableWithName(domain.Cover{}, "covers").SetKeys(true, "Id").AddIndex("CoverHashIndex", "nil", []string{"hash"})
	dbmap.AddTableWithName(business.InternalVariable{}, "variables").SetKeys(false, "Key")

	tracksTable := dbmap.AddTableWithName(domain.Track{}, "tracks")
	tracksTable.SetKeys(true, "Id")
	tracksTable.AddIndex("TrackTitleIndex", "nil", []string{"title"})
	tracksTable.AddIndex("TrackPathIndex", "nil", []string{"path"})

	// Create the tables.
	err = dbmap.CreateTablesIfNotExists()
	if err != nil {
		log.Fatalln("Create tables failed", err)
	}

	return dbmap, nil
}
