/*
Defines and initialize the GraphQL schema.
 */

package interfaces

import (
	"errors"
	"strconv"

	"github.com/graphql-go/graphql"
	"github.com/humbkr/albaplayer-server/internal/alba/version"

	"github.com/humbkr/albaplayer-server/internal/alba/business"
	"github.com/humbkr/albaplayer-server/internal/alba/domain"
)

type graphQLInteractor struct {
	Schema graphql.Schema
	Library *business.LibraryInteractor
}

// Defines static parts of artist type.
var artistType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Artist",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Name: "Artist ID",
			Description: "Artist unique Identifier.",
			Type: graphql.NewNonNull(graphql.ID),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if artist, ok := p.Source.(domain.Artist); ok == true {
					return artist.Id, nil
				}
				return nil, nil
			},
		},
		"name": &graphql.Field{
			Name: "Artist name",
			Description: "Name of the artist.",
			Type: graphql.NewNonNull(graphql.String),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if artist, ok := p.Source.(domain.Artist); ok == true {
					return artist.Name, nil
				}
				return nil, nil
			},
		},
		"albums": &graphql.Field{
			Name: "Artist albums",
			Description: "Albums of the artist.",
			Type: graphql.NewList(graphql.NewNonNull(albumType)),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if artist, ok := p.Source.(domain.Artist); ok == true {
					return artist.Albums, nil
				}
				return nil, nil
			},
		},
		"dateAdded": &graphql.Field{
			Name: "Date added",
			Description: "Date at which the artist has been added to the library.",
			Type: graphql.Int,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if artist, ok := p.Source.(domain.Artist); ok == true {
					return artist.DateAdded, nil
				}
				return nil, nil
			},
		},
	},
})

// Defines static parts of album type.
var albumType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Album",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Name: "Album ID",
			Description: "Album unique identifier.",
			Type: graphql.NewNonNull(graphql.ID),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.Id, nil
				}

				return nil, nil
			},
		},
		"title": &graphql.Field{
			Name: "Album title",
			Description: "Title of the album.",
			Type: graphql.NewNonNull(graphql.String),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.Title, nil
				}

				return nil, nil
			},
		},
		"year": &graphql.Field{
			Name: "Album year",
			Description: "Year the album was released in, or the year-span in case of a compilation of tracks from released in different years.",
			Type: graphql.String,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.Year, nil
				}

				return nil, nil
			},
		},
		"cover": &graphql.Field{
			Name: "Album cover",
			Description: "Url of the cover file.",
			Type: graphql.String,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true && album.CoverId != 0 {
					return "/covers/" + strconv.Itoa(album.CoverId), nil
				}
				return nil, nil
			},
		},
		"artistId": &graphql.Field{
			Name: "Artist ID",
			Description: "Shorthand property for performance, avoid loading an artist for each album.",
			Type: graphql.ID,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.ArtistId, nil
				}
				return nil, nil
			},
		},
		"tracks": &graphql.Field{
			Name: "Album tracks",
			Description: "Tracks of album.",
			Type: graphql.NewList(graphql.NewNonNull(trackType)),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.Tracks, nil
				}

				return nil, nil
			},
		},
		"dateAdded": &graphql.Field{
			Name: "Date added",
			Description: "Date at which the album has been added to the library.",
			Type: graphql.Int,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if album, ok := p.Source.(domain.Album); ok == true {
					return album.DateAdded, nil
				}
				return nil, nil
			},
		},
	},
})

// Defines static parts of track type.
var trackType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Track",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Name: "Track ID",
			Description: "Track unique Identifier.",
			Type: graphql.NewNonNull(graphql.ID),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Id, nil
				}
				return nil, nil
			},
		},
		"title": &graphql.Field{
			Name: "Track title",
			Description: "Title of the track.",
			Type: graphql.NewNonNull(graphql.String),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Title, nil
				}
				return nil, nil
			},
		},
		"disc": &graphql.Field{
			Name: "Track disc",
			Description: "If the album this track is on has multiple discs, specify the disc on which the track is on.",
			Type: graphql.String,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Disc, nil
				}
				return nil, nil
			},
		},
		"number": &graphql.Field{
			Name: "Track number",
			Description: "Position of the track on the album or disc.",
			Type: graphql.Int,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Number, nil
				}
				return nil, nil
			},
		},
		"duration": &graphql.Field{
			Name: "Track duration",
			Description: "Track duration in seconds.",
			Type: graphql.Int,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Duration, nil
				}
				return nil, nil
			},
		},
		"genre": &graphql.Field{
			Name: "Track genre",
			Description: "Music genre.",
			Type: graphql.String,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.Genre, nil
				}
				return nil, nil
			},
		},
		"src": &graphql.Field{
			Name: "Track path",
			Description: "Url of the media file.",
			Type: graphql.NewNonNull(graphql.String),
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return "/stream/" + strconv.Itoa(track.Id), nil
				}
				return nil, nil
			},
		},
		"cover": &graphql.Field{
			Name: "Track cover",
			Description: "Url of the cover file.",
			Type: graphql.String,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true && track.CoverId != 0 {
					return "/covers/" + strconv.Itoa(track.CoverId), nil
				}
				return nil, nil
			},
		},
		"artistId": &graphql.Field{
			Name: "Artist ID",
			Description: "Shorthand property for performance, avoid loading an artist for each track.",
			Type: graphql.ID,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.ArtistId, nil
				}
				return nil, nil
			},
		},
		"albumId": &graphql.Field{
			Name: "Album ID",
			Description: "Shorthand property for performance, avoid loading an album for each track.",
			Type: graphql.ID,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.AlbumId, nil
				}
				return nil, nil
			},
		},
		"dateAdded": &graphql.Field{
			Name: "Date added",
			Description: "Date at which the track has been added to the library.",
			Type: graphql.Int,
			Resolve: func (p graphql.ResolveParams) (interface{}, error) {
				if track, ok := p.Source.(domain.Track); ok == true {
					return track.DateAdded, nil
				}
				return nil, nil
			},
		},
	},
})

var libraryUpdateStateType = graphql.NewObject(graphql.ObjectConfig{
	Name: "LibraryUpdateState",
	Fields: graphql.Fields{
		"tracksNumber": &graphql.Field{
			Name:        "Number of tracks",
			Description: "Number of tracks in the library.",
			Type:        graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return nil, nil
			},
		},
		"albumsNumber": &graphql.Field{
			Name:        "Number of albums",
			Description: "Number of albums in the library.",
			Type:        graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return nil, nil
			},
		},
		"artistsNumber": &graphql.Field{
			Name:        "Number of artists",
			Description: "Number of artists in the library.",
			Type:        graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return nil, nil
			},
		},
	},
})

var internalVariableType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Variable",
	Fields: graphql.Fields{
		"key": &graphql.Field{
			Name:        "Key",
			Description: "Unique key of the variable.",
			Type:        graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if settings, ok := p.Source.(business.InternalVariable); ok == true {
					return settings.Key, nil
				}
				return nil, nil
			},
		},
		"value": &graphql.Field{
			Name:        "Value",
			Description: "Value of the variable",
			Type:        graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if settings, ok := p.Source.(business.InternalVariable); ok == true {
					return settings.Value, nil
				}
				return nil, nil
			},
		},
	},
})

var settingsType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Settings",
	Fields: graphql.Fields{
		"libraryPath": &graphql.Field{
			Name:        "Music library path",
			Description: "Absolute path of the music collection on disk.",
			Type:        graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if settings, ok := p.Source.(business.ClientSettings); ok == true {
					return settings.LibraryPath, nil
				}
				return nil, nil
			},
		},
		"coversPreferredSource": &graphql.Field{
			Name:        "Covers preferred source",
			Description: "Tracks and album covers preferred source when scanning the library. 'folder' or 'file'",
			Type:        graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if settings, ok := p.Source.(business.ClientSettings); ok == true {
					return settings.CoversPreferredSource, nil
				}
				return nil, nil
			},
		},
		"disableLibrarySettings": &graphql.Field{
			Name:        "Disable library settings",
			Description: "Whether the library settings are editable on the client side or not.",
			Type:        graphql.Boolean,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if settings, ok := p.Source.(business.ClientSettings); ok == true {
					return settings.DisableLibraryConfiguration, nil
				}
				return nil, nil
			},
		},
		"version": &graphql.Field{
			Name:        "Server version",
			Description: "Server version.",
			Type:        graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return version.Version, nil
			},
		},
	},
})

/*
Creates a new GraphQL interactor.

Builds GraphQL Schema, initialise dynamic fields on types.
 */
func NewGraphQLInteractor(ci *business.LibraryInteractor) *graphQLInteractor {
	interactor := &graphQLInteractor{Library:ci}

	// Define dynamic fields on types.
	albumType.AddFieldConfig("artist", &graphql.Field{
		Type: artistType,
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if album, ok := p.Source.(domain.Album); ok == true && album.ArtistId != 0 {
				return interactor.Library.ArtistRepository.Get(album.ArtistId)
			}

			return nil, nil
		},
	})
	trackType.AddFieldConfig("artist", &graphql.Field{
		Type: artistType,
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if track, ok := p.Source.(domain.Track); ok == true && track.ArtistId != 0 {
				return interactor.Library.ArtistRepository.Get(track.ArtistId)
			}

			return nil, nil
		},
	})
	trackType.AddFieldConfig("album", &graphql.Field{
		Type: albumType,
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if track, ok := p.Source.(domain.Track); ok == true && track.AlbumId != 0 {
				return interactor.Library.AlbumRepository.Get(track.AlbumId)
			}

			return nil, nil
		},
	})

	// This is the type that will be the root of our query,
	// and the entry point into our schema.
	rootQuery := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"artists": &graphql.Field{
				Type: graphql.NewList(artistType),
				Resolve: func (g graphql.ResolveParams) (interface{}, error) {
					return interactor.Library.GetAllArtists(false)
				},
			},
			"artist": &graphql.Field{
				Type: artistType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Description: "Artist ID",
						Type: graphql.NewNonNull(graphql.ID),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					i := p.Args["id"].(string)
					id, err := strconv.Atoi(i)
					if err != nil {
						return nil, err
					}

					return interactor.Library.ArtistRepository.Get(id)
				},
			},
			"albums": &graphql.Field{
				Type: graphql.NewList(albumType),
				Args: graphql.FieldConfigArgument{
					"hydrate": &graphql.ArgumentConfig{
						Description: "Enable possibility to get tracks from albums list. Default to false.",
						Type: graphql.Boolean,
					},
				},
				Resolve: func (p graphql.ResolveParams) (interface{}, error) {
					if p.Args["hydrate"] != nil {
						if hydrate, ok := p.Args["hydrate"].(bool); ok {
							return interactor.Library.AlbumRepository.GetAll(hydrate)
						}
					}

					return interactor.Library.AlbumRepository.GetAll(false)
				},
			},
			"album": &graphql.Field{
				Type: albumType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Description: "Album ID",
						Type: graphql.NewNonNull(graphql.ID),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					i := p.Args["id"].(string)
					id, err := strconv.Atoi(i)
					if err != nil {
						return nil, err
					}

					return interactor.Library.AlbumRepository.Get(id)
				},
			},
			"tracks": &graphql.Field{
				Type: graphql.NewList(trackType),
				Resolve: func (g graphql.ResolveParams) (interface{}, error) {
					return interactor.Library.TrackRepository.GetAll()
				},
			},
			"track": &graphql.Field{
				Type: trackType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Description: "Track ID",
						Type: graphql.NewNonNull(graphql.ID),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					i := p.Args["id"].(string)
					id, err := strconv.Atoi(i)
					if err != nil {
						return nil, err
					}

					return interactor.Library.TrackRepository.Get(id)
				},
			},
			"settings": &graphql.Field{
				Type: settingsType,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					settingsInteractor := business.ClientSettingsInteractor{}
					return settingsInteractor.GetSettings(), nil
				},
			},
			"variable": &graphql.Field{
				Type: internalVariableType,
				Args: graphql.FieldConfigArgument{
					"key": &graphql.ArgumentConfig{
						Description: "Key",
						Type: graphql.NewNonNull(graphql.ID),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					key := p.Args["key"].(string)
					// Return nil if no variable found instead of an error.
					variable, err := interactor.Library.InternalVariableRepository.Get(key)
					if err == nil {
						return variable, err
					}

					return nil, nil
				},
			},

			// TODO: I don't think using queries here is okay.
			"updateLibrary": &graphql.Field{
				Type: libraryUpdateStateType,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if interactor.Library.LibraryIsUpdating {
						return nil, errors.New("library currently updating")
					}
					interactor.Library.UpdateLibrary()

					return nil, nil
				},
			},
			"eraseLibrary": &graphql.Field{
				Type: libraryUpdateStateType,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if interactor.Library.LibraryIsUpdating {
						return nil, errors.New("library currently updating")
					}
					interactor.Library.EraseLibrary()

					return nil, nil
				},
			},
		},
	})

	/*
	 * Finally, we construct our schema (whose starting query type is the query
	 * type we defined above) and export it.
	 */
	var err error
	interactor.Schema, err = graphql.NewSchema(graphql.SchemaConfig{
		Query: rootQuery,
	})
	if err != nil {
		panic(err)
	}

	return interactor
}
