package cmd

import (
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"path/filepath"

	gqlHandler "github.com/graphql-go/handler"
	"github.com/humbkr/albaplayer-server/internal/alba"
	"github.com/humbkr/albaplayer-server/internal/alba/interfaces"
	"github.com/markbates/pkger"
	"github.com/mnmtanish/go-graphiql"
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
		libraryInteractor := alba.InitApp()

		// Initialize GraphQL stuff.
		graphQLInteractor := interfaces.NewGraphQLInteractor(&libraryInteractor)

		// Create a graphl-go HTTP handler with our previously defined schema
		// and set it to return pretty JSON output.
		graphQLHandler := gqlHandler.New(&gqlHandler.Config{
			Schema: &graphQLInteractor.Schema,
			Pretty: true,
		})

		mux := http.NewServeMux()

		// Serve a GraphQL endpoint at `/graphql`.
		// Make the server handle cross-domain requests.
		mux.Handle("/graphql", graphQLHandler)

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

		if viper.GetBool("DevMode.Enabled") {
			// Serve graphiql.
			mux.HandleFunc("/graphiql", graphiql.ServeGraphiQL)
		}

		rootHandler := cors.Default().Handler(mux)

		// Launch the server.
		if viper.GetBool("Server.Https.Enabled") {
			fmt.Printf("Server is up on port %s (https)\n", viper.GetString("Server.Port"))
			errServ := http.ListenAndServeTLS(
				":" + viper.GetString("Server.Port"),
				viper.GetString("Server.Https.CertFile"),
				viper.GetString("Server.Https.KeyFile"),
				rootHandler)

			if errServ != nil {
				fmt.Printf("ERROR: %s\n", errServ.Error())
			}
		} else {
			fmt.Printf("Server is up on port %s (http)\n", viper.GetString("Server.Port"))
			if err := http.ListenAndServe(":" + viper.GetString("Server.Port"), rootHandler); err != nil {
				log.Fatal(err)
			}
		}
	},
}
