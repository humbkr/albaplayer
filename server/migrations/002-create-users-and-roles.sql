-- +migrate Up
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at INTEGER,
);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS users_roles (
  user_id INTEGER,
  role_id INTEGER,
  PRIMARY KEY (user_id, role_id),
);

INSERT INTO roles (name) VALUES ("owner");
INSERT INTO roles (name) VALUES ("admin");
INSERT INTO roles (name) VALUES ("listener");

-- +migrate Down
PRAGMA foreign_keys=off;

DROP TABLE users_roles;
DROP TABLE users;
DROP TABLE roles;

PRAGMA foreign_keys=on;
