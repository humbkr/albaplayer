// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type LibraryUpdateState struct {
	TracksNumber  *int `json:"tracksNumber"`
	AlbumsNumber  *int `json:"albumsNumber"`
	ArtistsNumber *int `json:"artistsNumber"`
}

type Settings struct {
	LibraryPath            *string `json:"libraryPath"`
	CoversPreferredSource  *string `json:"coversPreferredSource"`
	DisableLibrarySettings *bool   `json:"disableLibrarySettings"`
	Version                *string `json:"version"`
	AuthEnabled            *bool   `json:"authEnabled"`
}

type UserInput struct {
	Name            *string   `json:"name"`
	Email           *string   `json:"email"`
	Password        *string   `json:"password"`
	CurrentPassword *string   `json:"currentPassword"`
	Data            *string   `json:"data"`
	Roles           []*string `json:"roles"`
}

type Variable struct {
	Key   *string `json:"key"`
	Value *string `json:"value"`
}
