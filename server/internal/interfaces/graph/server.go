package graph

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/generated"
	"github.com/humbkr/albaplayer/internal/version"
	"net/http"
)

type GraphQLServerInitialData struct {
	LibraryInteractor  *business.LibraryInteractor
	SettingsInteractor *business.ClientSettingsInteractor
	UsersInteractor    *business.UsersInteractor
}

func InitGraphQLServer(initialData GraphQLServerInitialData) http.Handler {
	// Create the graphql handler
	graphQLHandler := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{
		Library:         initialData.LibraryInteractor,
		ClientSettings:  initialData.SettingsInteractor,
		UsersInteractor: initialData.UsersInteractor,
		Version:         version.Version,
	}}))

	// Create graphql data loaders for performance
	dataLoaders := NewDataLoaders(initialData.LibraryInteractor)

	// Wrap the graphql handler with middleware to inject data loaders
	dataloaderHandler := Middleware(dataLoaders, graphQLHandler)

	return dataloaderHandler
}
