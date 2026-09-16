-- +migrate Up
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_albums_title_artist ON albums(title, artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_path ON tracks(path);
CREATE INDEX IF NOT EXISTS idx_covers_hash ON covers(hash);

-- +migrate Down
DROP INDEX IF EXISTS idx_artists_name;
DROP INDEX IF EXISTS idx_albums_title_artist;
DROP INDEX IF EXISTS idx_tracks_path;
DROP INDEX IF EXISTS idx_covers_hash;
