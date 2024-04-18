package cmd

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/humbkr/albaplayer/internal"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/interfaces/auth"
	"github.com/humbkr/albaplayer/internal/interfaces/graph"
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
		libraryInteractor, usersInteractor, internalVariablesInteractor := internal.InitApp()
		settingsInteractor := business.ClientSettingsInteractor{
			UserInteractor: usersInteractor,
		}

		initialData := graph.GraphQLServerInitialData{
			LibraryInteractor:          &libraryInteractor,
			SettingsInteractor:         &settingsInteractor,
			UsersInteractor:            &usersInteractor,
			InternalVariableInteractor: &internalVariablesInteractor,
		}

		graphQLHandler := graph.InitGraphQLServer(initialData)

		mux := http.NewServeMux()

		var middleware func(http.Handler) http.Handler
		if viper.GetBool("Users.AuthEnabled") {
			middleware = auth.AuthMiddleware()
		} else {
			middleware = auth.NoAuthMiddleware()
		}

		mux.Handle("/graphql", middleware(graphQLHandler))

		if viper.GetBool("DevMode.Enabled") {
			// Serve graphiql.
			mux.Handle("/graphiql", playground.Handler("GraphQL playground", "/graphql"))
		}

		// Serve media files streaming endpoint.
		mediaFilesHandler := interfaces.NewMediaStreamHandler(&libraryInteractor)
		mux.Handle("/stream/", http.StripPrefix("/stream/", middleware(mediaFilesHandler)))

		// Serve media files streaming endpoint.
		coverFilesHandler := interfaces.NewCoverStreamHandler(&libraryInteractor)
		mux.Handle("/covers/", http.StripPrefix("/covers/", middleware(coverFilesHandler)))

		if viper.GetBool("Users.AuthEnabled") {
			// Serve auth endpoints
			auth := &auth.AuthHandlers{UserInteractor: &usersInteractor, LibraryInteractor: &libraryInteractor}
			mux.HandleFunc("/auth/login", auth.Login)
			mux.HandleFunc("/auth/logout", auth.Logout)
			mux.HandleFunc("/auth/refresh-token", auth.RefreshToken)
			mux.HandleFunc("/auth/create-root", auth.CreateRootUser)
		}

		// Serve app config.
		appConfigHandler := interfaces.NewAppConfigHandler(&usersInteractor)
		mux.HandleFunc("/config", appConfigHandler.GetAppConfig)

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
		allowedOrigins := viper.GetStringSlice("DevMode.AllowedOrigins")
		rootHandler := cors.New(cors.Options{
			AllowCredentials:   true,
			AllowedOrigins:     allowedOrigins,
			AllowedMethods:     []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodPut},
			AllowedHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
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
