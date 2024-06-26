// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type CollectionInput struct {
	UserID *int    `json:"userId,omitempty"`
	Title  *string `json:"title,omitempty"`
	Type   *string `json:"type,omitempty"`
	Items  *string `json:"items,omitempty"`
}

type LibraryUpdateState struct {
	TracksNumber  *int `json:"tracksNumber,omitempty"`
	AlbumsNumber  *int `json:"albumsNumber,omitempty"`
	ArtistsNumber *int `json:"artistsNumber,omitempty"`
}

type Mutation struct {
}

type Query struct {
}

type Settings struct {
	LibraryPath            *string `json:"libraryPath,omitempty"`
	CoversPreferredSource  *string `json:"coversPreferredSource,omitempty"`
	DisableLibrarySettings *bool   `json:"disableLibrarySettings,omitempty"`
	Version                *string `json:"version,omitempty"`
	AuthEnabled            *bool   `json:"authEnabled,omitempty"`
	AdminUserCreated       *bool   `json:"adminUserCreated,omitempty"`
}

type UserInput struct {
	Name            *string   `json:"name,omitempty"`
	Email           *string   `json:"email,omitempty"`
	Password        *string   `json:"password,omitempty"`
	CurrentPassword *string   `json:"currentPassword,omitempty"`
	Data            *string   `json:"data,omitempty"`
	Roles           []*string `json:"roles,omitempty"`
}

type Variable struct {
	Key   *string `json:"key,omitempty"`
	Value *string `json:"value,omitempty"`
}
