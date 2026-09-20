-- +migrate Up
CREATE TABLE IF NOT EXISTS scan_cache (
  path TEXT PRIMARY KEY,
  mtime INTEGER NOT NULL,
  size  INTEGER NOT NULL
);

-- +migrate Down
DROP TABLE IF EXISTS scan_cache;
