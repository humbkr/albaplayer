-- +migrate Up
CREATE TABLE IF NOT EXISTS artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  year VARCHAR(255),
  artist_id INTEGER,
  cover_id INTEGER
);

CREATE TABLE IF NOT EXISTS tracks (
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

CREATE TABLE IF NOT EXISTS covers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path VARCHAR(255),
  hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS variables (
  key VARCHAR(255) PRIMARY KEY,
  value VARCHAR(255)
);

-- +migrate Down
DROP TABLE albums;
DROP TABLE artists;
DROP TABLE covers;
DROP TABLE tracks;
DROP TABLE variables;
