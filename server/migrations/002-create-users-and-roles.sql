-- +migrate Up
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255),
  config VARCHAR(2048),
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS users_roles (
  user_id INTEGER,
  role_name VARCHAR(255),
  PRIMARY KEY (user_id, role_name)
);

-- Create a default owner user.
INSERT INTO users(id, name, email, password, config, created_at) VALUES(1, "owner", "", "$2a$14$B9771rhQvkFaaJJ9Zyz5POXGF6MMyWqik4SquUFM7C3dO3jbuRrhq", "", UNIXEPOCH());
INSERT INTO users_roles(user_id, role_name) VALUES(1, "owner");
INSERT INTO users_roles(user_id, role_name) VALUES(1, "admin");
INSERT INTO users_roles(user_id, role_name) VALUES(1, "listener");

-- +migrate Down
PRAGMA foreign_keys=off;

DROP TABLE users_roles;
DROP TABLE users;

PRAGMA foreign_keys=on;
