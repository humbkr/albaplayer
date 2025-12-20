-- +migrate Up
ALTER TABLE artists ADD created_at INTEGER;
ALTER TABLE albums ADD created_at INTEGER;
ALTER TABLE tracks ADD created_at INTEGER;

UPDATE artists SET created_at = strftime('%s', 'now');
UPDATE albums SET created_at = strftime('%s', 'now');
UPDATE tracks SET created_at = strftime('%s', 'now');

-- +migrate Down
PRAGMA foreign_keys=off;

ALTER TABLE artists RENAME TO _artists_old;
CREATE TABLE artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255)
);

INSERT INTO artists (id, name)
SELECT id, name
FROM _artists_old;

ALTER TABLE albums RENAME TO _albums_old;
CREATE TABLE albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  year VARCHAR(255),
  artist_id INTEGER,
  cover_id INTEGER
);

INSERT INTO albums (id, title, year, artist_id, cover_id)
SELECT id, title, year, artist_id, cover_id
FROM _albums_old;

ALTER TABLE tracks RENAME TO _tracks_old;
CREATE TABLE tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  album_id INTEGER,
  artist_id INTEGER,
  cover_id INTEGER,
  disc VARCHAR(255),
  number INTEGER,
  duration INTEGER,
  genre VARCHAR(255),
  path VARCHAR(255)
);

INSERT INTO tracks (id, title, album_id, artist_id, cover_id, disc, number, duration, genre, path)
SELECT id, title, album_id, artist_id, cover_id, disc, number, duration, genre, path
FROM _tracks_old;

DROP TABLE _artists_old;
DROP TABLE _albums_old;
DROP TABLE _tracks_old;

PRAGMA foreign_keys=on;
