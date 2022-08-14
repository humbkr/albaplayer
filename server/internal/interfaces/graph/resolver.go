package graph

import "github.com/humbkr/albaplayer/internal/business"

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Library         *business.LibraryInteractor
	ClientSettings  *business.ClientSettingsInteractor
	UsersInteractor *business.UsersInteractor
	Version         string
}
