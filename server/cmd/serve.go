package cmd

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/humbkr/albaplayer/internal"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/interfaces/graph"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/generated"
	"github.com/humbkr/albaplayer/internal/version"
	"io"
	"log"
	"mime"
	"net/http"
	"path/filepath"

	"github.com/humbkr/albaplayer/internal/interfaces"
	"github.com/markbates/pkger"
	"github.com/rs/cors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func init() {
	rootCmd.AddCommand(serveCmd)
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve app on the specified port",
	Long:  `Launch all services, create all endpoints, and serve UI web app.`,
	Run: func(cmd *cobra.Command, args []string) {
		libraryInteractor := internal.InitApp()
		settingsInteractor := business.ClientSettingsInteractor{}

		// Create the graphql handler
		graphQLHandler := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
			Library:        &libraryInteractor,
			ClientSettings: &settingsInteractor,
			Version:        version.Version,
		}}))

		// Create graphql data loaders for performance
		dataLoaders := graph.NewDataLoaders(&libraryInteractor)

		// Wrap the graphql handler with middleware to inject data loaders
		dataloaderHandler := graph.Middleware(dataLoaders, graphQLHandler)

		mux := http.NewServeMux()

		// Serve the GraphQL endpoint at `/graphql`.
		mux.Handle("/graphql", dataloaderHandler)

		if viper.GetBool("DevMode.Enabled") {
			// Serve graphiql.
			mux.Handle("/graphiql", playground.Handler("GraphQL playground", "/graphql"))
		}

		// Serve media files streaming endpoint.
		// Makes the server handle cross-domain requests.
		mediaFilesHandler := interfaces.NewMediaStreamHandler(&libraryInteractor)
		mux.Handle("/stream/", http.StripPrefix("/stream/", mediaFilesHandler))

		// Serve media files streaming endpoint.
		// Makes the server handle cross-domain requests.
		coverFilesHandler := interfaces.NewCoverStreamHandler(&libraryInteractor)
		mux.Handle("/covers/", http.StripPrefix("/covers/", coverFilesHandler))

		// Serve SPA.
		fileServer := http.FileServer(pkger.Dir("/web"))
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			// Will serve requested file if present in the directory, or redirect
			// to the SPA index file if not.
			path, err := filepath.Abs(r.URL.Path)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			path = filepath.Join("/web", path)

			_, err = pkger.Stat(path)
			if err != nil {
				// File does not exist, let the SPA handle the routing.
				w.Header().Add("Content-Type", mime.TypeByExtension(".html"))
				file, err := pkger.Open("/web/index.html")
				defer file.Close()

				if err != nil {
					http.Error(w, err.Error(), http.StatusNotFound)
					return
				}
				_, _ = io.Copy(w, file)
				return
			}

			fileServer.ServeHTTP(w, r)
		})

		// Create the root handler with CORS to make the server handle cross-domain requests.
		rootHandler := cors.New(cors.Options{
			AllowCredentials: true,
			// Enable Debugging for testing.
			Debug:              viper.GetBool("DevMode.Enabled"),
			OptionsPassthrough: false,
		}).Handler(mux)

		// Launch the server.
		if viper.GetBool("Server.Https.Enabled") {
			fmt.Printf("Server is up on port %s (https)\n", viper.GetString("Server.Port"))
			errServ := http.ListenAndServeTLS(
				":"+viper.GetString("Server.Port"),
				viper.GetString("Server.Https.CertFile"),
				viper.GetString("Server.Https.KeyFile"),
				rootHandler)

			if errServ != nil {
				fmt.Printf("ERROR: %s\n", errServ.Error())
			}
		} else {
			fmt.Printf("Server is up on port %s (http)\n", viper.GetString("Server.Port"))
			if err := http.ListenAndServe(":"+viper.GetString("Server.Port"), rootHandler); err != nil {
				log.Fatal(err)
			}
		}
	},
}
