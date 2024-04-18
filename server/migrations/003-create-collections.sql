-- +migrate Up
-- Create a Collections table.
CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    items VARCHAR(2048),
    created_at INTEGER
);

-- +migrate Down
PRAGMA foreign_keys=off;

DROP TABLE collections;

PRAGMA foreign_keys=on;
