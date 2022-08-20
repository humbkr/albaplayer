package utils

import (
	"os"
	"strings"
)

// GetOSTempDir returns the OS temp dir with a trailing OS path separator.
func GetOSTempDir() string {
	// Temp path may or may not have a trailing separator depending on OS.
	return strings.TrimSuffix(os.TempDir(), string(os.PathSeparator)) + string(os.PathSeparator)
}
