package interfaces

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/spf13/viper"
)


type mediaStreamHandler struct {
	Interactor *business.LibraryInteractor
}

func NewMediaStreamHandler(ci *business.LibraryInteractor) *mediaStreamHandler {
	return &mediaStreamHandler{Interactor: ci}
}

// Streams a file located on disk from a track id.
func (h mediaStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	trackId, err := strconv.Atoi(r.URL.Path)
	if err != nil {
		fmt.Fprint(w, "Invalid id")
		return
	}

	// Try to find a corresponding track.
	track, err := h.Interactor.TrackRepository.Get(trackId)
	if err != nil {
		fmt.Fprint(w, "Track not found")
		return
	}

	http.ServeFile(w, r, track.Path)
	return
}

type coverStreamHandler struct {
	Interactor *business.LibraryInteractor
}

func NewCoverStreamHandler(ci *business.LibraryInteractor) *coverStreamHandler {
	return &coverStreamHandler{Interactor: ci}
}

// Streams a file located on disk from a track id.
func (h coverStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	coverId, err := strconv.Atoi(r.URL.Path)
	if err != nil {
		fmt.Fprint(w, "Invalid id")
		return
	}

	// Try to find a cover.
	cover, err := h.Interactor.CoverRepository.Get(coverId)
	if err != nil {
		fmt.Fprint(w, "Cover not found")
		return
	}

	filePath := viper.GetString("Covers.Directory") + "/" + cover.Path

	http.ServeFile(w, r, filePath)
	return
}
