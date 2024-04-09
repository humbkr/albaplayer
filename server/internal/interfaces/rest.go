package interfaces

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
)

type mediaStreamHandler struct {
	Interactor *business.LibraryInteractor
}

func NewMediaStreamHandler(ci *business.LibraryInteractor) *mediaStreamHandler {
	return &mediaStreamHandler{Interactor: ci}
}

// ServeHTTP streams a file located on disk from a track id.
func (h mediaStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	trackId, err := strconv.Atoi(r.URL.Path)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	// Try to find a corresponding track.
	track, err := h.Interactor.TrackRepository.Get(trackId)
	if err != nil {
		http.Error(w, "Track not found", http.StatusNotFound)
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

// ServeHTTP streams a file located on disk from a track id.
func (h coverStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	coverId, err := strconv.Atoi(r.URL.Path)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	// Try to find a cover.
	cover, err := h.Interactor.CoverRepository.Get(coverId)
	if err != nil {
		http.Error(w, "Cover not found", http.StatusNotFound)
		return
	}

	filePath := viper.GetString("Covers.Directory") + "/" + cover.Path

	http.ServeFile(w, r, filePath)
	return
}

type appConfigHandler struct {
	UserInteractor *business.UsersInteractor
}

func NewAppConfigHandler(ui *business.UsersInteractor) *appConfigHandler {
	return &appConfigHandler{UserInteractor: ui}
}

func (a appConfigHandler) GetAppConfig(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	rootUserExists := a.UserInteractor.UserExists(1)

	resp := struct {
		AuthEnabled                 bool `json:"auth_enabled"`
		DisableLibraryConfiguration bool `json:"library_configuration_disabled"`
		RootUserCreated             bool `json:"root_user_created"`
	}{
		AuthEnabled:                 viper.GetBool("Users.AuthEnabled"),
		DisableLibraryConfiguration: viper.GetBool("ClientSettings.DisableLibraryConfiguration"),
		RootUserCreated:             rootUserExists,
	}

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("Unable to marshall user to JSON. Err: %s", err)
	}
	w.Write(jsonResp)
}
