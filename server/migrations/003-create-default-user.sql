-- +migrate Up
-- Create a default owner user.
INSERT INTO users(id, name, email, password, config, created_at) VALUES(1, "owner", "", "", "", UNIXEPOCH());
INSERT INTO users_roles(user_id, role_name) VALUES(1, "owner");
INSERT INTO users_roles(user_id, role_name) VALUES(1, "admin");
INSERT INTO users_roles(user_id, role_name) VALUES(1, "listener");

-- +migrate Down
PRAGMA foreign_keys=off;

DELETE FROM users_roles WHERE user_id = 1;
DELETE FROM users WHERE id = 1;

PRAGMA foreign_keys=on;
