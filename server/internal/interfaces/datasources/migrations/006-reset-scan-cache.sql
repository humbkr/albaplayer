-- Force a full rescan so that track durations, now computed from the audio
-- stream, are filled in for files that were already in the library.

-- +migrate Up
DELETE FROM scan_cache;

-- +migrate Down
