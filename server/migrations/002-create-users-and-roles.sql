-- +migrate Up
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  config VARCHAR(2048),
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS users_roles (
  user_id INTEGER,
  role_name VARCHAR(255),
  PRIMARY KEY (user_id, role_name)
);

-- +migrate Down
PRAGMA foreign_keys=off;

DROP TABLE users_roles;
DROP TABLE users;

PRAGMA foreign_keys=on;
