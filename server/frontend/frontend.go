package frontend

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed dist/*
var FrontendFiles embed.FS

// BuildFrontendFileSystem gets the subtree of the embedded files
// with 'frontend' directory as a root.
func BuildFrontendFileSystem() http.FileSystem {
	build, err := fs.Sub(FrontendFiles, "dist")
	if err != nil {
		log.Fatal(err)
	}

	return http.FS(build)
}
