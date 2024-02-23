package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/humbkr/albaplayer/internal/interfaces/auth"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/generated"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/model"
	"github.com/spf13/viper"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/exp/slices"
)

func (r *albumResolver) Artist(ctx context.Context, obj *model.Album) (*model.Artist, error) {
	// Do not search for artist if album has no artist.
	if obj.ArtistID == 0 {
		return nil, nil
	}

	return GetArtist(ctx, obj.ArtistID)
}

func (r *albumResolver) Cover(ctx context.Context, obj *model.Album) (*string, error) {
	if *obj.Cover != 0 {
		coverEndpoint := "/covers/" + strconv.Itoa(*obj.Cover)
		return &coverEndpoint, nil
	}

	return nil, nil
}

func (r *albumResolver) Tracks(ctx context.Context, obj *model.Album) ([]*model.Track, error) {
	var result []*model.Track
	tracks, err := r.Library.GetTracksForAlbum(obj.ID)

	if err == nil {
		for _, track := range tracks {
			gqlTrack := convertTrack(track)
			result = append(result, &gqlTrack)
		}
	}

	return result, err
}

func (r *artistResolver) Albums(ctx context.Context, obj *model.Artist) ([]*model.Album, error) {
	var result []*model.Album
	albums, err := r.Library.GetAlbumsForArtist(obj.ID, false)

	if err == nil {
		for _, album := range albums {
			gqlAlbum := convertAlbum(album)
			result = append(result, &gqlAlbum)
		}
	}

	return result, err
}

func (r *mutationResolver) UpdateLibrary(ctx context.Context) (*model.LibraryUpdateState, error) {
	if r.Library.LibraryIsUpdating {
		return nil, fmt.Errorf("library currently updating")
	}

	r.Library.UpdateLibrary()

	countArtists, _ := r.Library.ArtistsCount()
	countAlbums, _ := r.Library.AlbumsCount()
	countTracks, _ := r.Library.TracksCount()

	updateLibraryState := model.LibraryUpdateState{
		TracksNumber:  &countTracks,
		AlbumsNumber:  &countAlbums,
		ArtistsNumber: &countArtists,
	}

	return &updateLibraryState, nil
}

func (r *mutationResolver) EraseLibrary(ctx context.Context) (*model.LibraryUpdateState, error) {
	currentUser := auth.GetUserFromContext(ctx)
	if !business.UserHasRole(*currentUser, business.ROLE_OWNER) {
		return nil, errors.New("unauthorized operation")
	}

	if r.Library.LibraryIsUpdating {
		return nil, fmt.Errorf("library currently updating")
	}

	r.Library.EraseLibrary()

	countArtists, _ := r.Library.ArtistsCount()
	countAlbums, _ := r.Library.AlbumsCount()
	countTracks, _ := r.Library.TracksCount()

	updateLibraryState := model.LibraryUpdateState{
		TracksNumber:  &countTracks,
		AlbumsNumber:  &countAlbums,
		ArtistsNumber: &countArtists,
	}

	return &updateLibraryState, nil
}

func (r *mutationResolver) CreateUser(ctx context.Context, input model.UserInput) (*model.User, error) {
	hashedPassword, _ := auth.HashPassword(*input.Password)

	user := auth.GetUserFromContext(ctx)
	if !business.UserHasRole(*user, business.ROLE_ADMIN) {
		return nil, errors.New("unauthorized operation")
	}

	dbUser := business.User{
		Name:     *input.Name,
		Password: hashedPassword,
	}

	dbUser.Roles = processUserRoles(input.Roles)

	if dbUser.Name == "" || dbUser.Password == "" || len(dbUser.Roles) < 1 {
		return nil, errors.New("the following fields are mandatory: name, email, password, roles")
	}

	err := r.UsersInteractor.SaveUser(&dbUser)
	if err != nil {
		return nil, err
	}

	createdUser := convertUser(dbUser, false)

	return &createdUser, nil
}

func (r *mutationResolver) UpdateUser(ctx context.Context, id int, input model.UserInput) (*model.User, error) {
	currentUser := auth.GetUserFromContext(ctx)
	if currentUser.Id != id && !business.UserHasRole(*currentUser, business.ROLE_ADMIN) {
		return nil, errors.New("unauthorized operation")
	}
	updateOneself := false
	if currentUser.Id == id {
		updateOneself = true
	}

	// Get current user data from DB to update it.
	dbUser, err := r.UsersInteractor.GetUser(id)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if input.Name != nil && *input.Name != "" {
		username := strings.TrimSpace(*input.Name)
		if hasWhitespace := regexp.MustCompile(`\s`).MatchString(username); hasWhitespace {
			graphql.AddError(ctx, &gqlerror.Error{
				Path:    graphql.GetPath(ctx),
				Message: "No whitespace allowed in username",
				Extensions: map[string]interface{}{
					"code": "no_whitespace_allowed",
				},
			})

			return nil, nil
		}

		dbUser.Name = username
	}

	if input.Email != nil && *input.Email != "" {
		dbUser.Email = *input.Email
	}

	if input.Data != nil && *input.Data != "" {
		dbUser.Data = *input.Data
	}

	if input.Roles != nil && len(input.Roles) > 0 {
		dbUser.Roles = processUserRoles(input.Roles)
	}

	if input.Password != nil && *input.Password != "" {
		// User is trying to change a password.
		if updateOneself {
			// User is trying to change his own password.
			// Check if current password is correct.
			err := auth.CheckPassword(dbUser.Password, *input.CurrentPassword)
			if *input.Password == "" || err != nil {
				graphql.AddError(ctx, &gqlerror.Error{
					Path:    graphql.GetPath(ctx),
					Message: "Invalid current password",
					Extensions: map[string]interface{}{
						"code": "invalid_current_password",
					},
				})

				return nil, nil
			}
		}
		// Else the action comes from an admin updating another user, so no need to check
		// current password.

		hashedPassword, _ := auth.HashPassword(*input.Password)
		dbUser.Password = hashedPassword
	}

	err = r.UsersInteractor.SaveUser(&dbUser)
	if err != nil {
		return nil, err
	}

	updatedUser := convertUser(dbUser, false)

	return &updatedUser, nil
}

func (r *mutationResolver) DeleteUser(ctx context.Context, id int) (bool, error) {
	user := auth.GetUserFromContext(ctx)
	if user.Id != id && !business.UserHasRole(*user, business.ROLE_ADMIN) {
		return false, errors.New("unauthorized operation")
	}

	dbUser := business.User{
		Id: id,
	}

	err := r.UsersInteractor.DeleteUser(&dbUser)
	return err == nil, err
}

func (r *mutationResolver) CreateCollection(ctx context.Context, input model.CollectionInput) (*model.Collection, error) {
	user := auth.GetUserFromContext(ctx)
	if user.Id == 0 {
		return nil, errors.New("unauthorized operation")
	}

	dbCollection := domain.Collection{
		UserId: user.Id,
		Title:  *input.Title,
		Type:   *input.Type,
		Items:  *input.Items,
	}

	err := r.Library.SaveCollection(&dbCollection)
	if err != nil {
		return nil, err
	}

	createdCollection := convertCollection(dbCollection)

	return &createdCollection, nil
}

func (r *mutationResolver) UpdateCollection(ctx context.Context, id int, input model.CollectionInput) (*model.Collection, error) {
	user := auth.GetUserFromContext(ctx)
	if user.Id == 0 {
		return nil, errors.New("unauthorized operation")
	}

	// Get current collection data from DB to update it.
	dbCollection, err := r.Library.GetCollection(id)
	if err != nil {
		return nil, errors.New("collection not found")
	}
	if user.Id != dbCollection.UserId {
		return nil, errors.New("unauthorized operation")
	}

	dbCollection.Title = *input.Title
	dbCollection.Type = *input.Type
	dbCollection.Items = *input.Items

	err = r.Library.SaveCollection(&dbCollection)
	if err != nil {
		return nil, err
	}

	createdCollection := convertCollection(dbCollection)

	return &createdCollection, nil
}

func (r *mutationResolver) DeleteCollection(ctx context.Context, id int) (bool, error) {
	user := auth.GetUserFromContext(ctx)
	if user.Id == 0 {
		return false, errors.New("unauthorized operation")
	}

	// Get current collection data from DB to check owner.
	dbCollection, err := r.Library.GetCollection(id)
	if err != nil {
		return false, errors.New("collection not found")
	}
	if user.Id != dbCollection.UserId {
		return false, errors.New("unauthorized operation")
	}

	err = r.Library.DeleteCollection(&dbCollection)

	return err == nil, err
}

func (r *queryResolver) Album(ctx context.Context, id int) (*model.Album, error) {
	return GetAlbum(ctx, id)
}

func (r *queryResolver) Albums(ctx context.Context) ([]*model.Album, error) {
	var result []*model.Album
	albums, err := r.Library.GetAllAlbums(false)

	if err == nil {
		for _, album := range albums {
			gqlAlbum := convertAlbum(album)
			result = append(result, &gqlAlbum)
		}
	}

	return result, err
}

func (r *queryResolver) Artist(ctx context.Context, id int) (*model.Artist, error) {
	return GetArtist(ctx, id)
}

func (r *queryResolver) Artists(ctx context.Context) ([]*model.Artist, error) {
	var result []*model.Artist
	artists, err := r.Library.GetAllArtists(false)

	if err == nil {
		for _, artist := range artists {
			gqlArtist := convertArtist(artist)
			result = append(result, &gqlArtist)
		}
	}

	return result, err
}

func (r *queryResolver) Collection(ctx context.Context, id int) (*model.Collection, error) {
	var result model.Collection
	collection, err := r.Library.GetCollection(id)

	if err == nil {
		result = convertCollection(collection)
	}

	return &result, err
}

func (r *queryResolver) Collections(ctx context.Context) ([]*model.Collection, error) {
	currentUser := auth.GetUserFromContext(ctx)

	var result []*model.Collection
	collectionTracks, errTracks := r.Library.GetAllCollections("tracks", currentUser.Id)
	collectionAlbums, errAlbums := r.Library.GetAllCollections("albums", currentUser.Id)
	collectionArtists, errArtists := r.Library.GetAllCollections("artists", currentUser.Id)

	if errTracks == nil {
		for _, collection := range collectionTracks {
			gqlCollection := convertCollection(collection)
			result = append(result, &gqlCollection)
		}
	}
	if errAlbums == nil {
		for _, collection := range collectionAlbums {
			gqlCollection := convertCollection(collection)
			result = append(result, &gqlCollection)
		}
	}
	if errArtists == nil {
		for _, collection := range collectionArtists {
			gqlCollection := convertCollection(collection)
			result = append(result, &gqlCollection)
		}
	}

	err := errors.Join(errTracks, errAlbums, errArtists)

	return result, err
}

func (r *queryResolver) Track(ctx context.Context, id int) (*model.Track, error) {
	var result model.Track
	track, err := r.Library.GetTrack(id)

	if err == nil {
		result = convertTrack(track)
	}

	return &result, err
}

func (r *queryResolver) Tracks(ctx context.Context) ([]*model.Track, error) {
	var result []*model.Track
	tracks, err := r.Library.GetAllTracks()

	if err == nil {
		for _, track := range tracks {
			gqlTrack := convertTrack(track)
			result = append(result, &gqlTrack)
		}
	}

	return result, err
}

func (r *queryResolver) Settings(ctx context.Context) (*model.Settings, error) {
	settings := r.ClientSettings.GetSettings()

	return &model.Settings{
		LibraryPath:            &settings.LibraryPath,
		CoversPreferredSource:  &settings.CoversPreferredSource,
		DisableLibrarySettings: &settings.DisableLibraryConfiguration,
		Version:                &r.Version,
		AuthEnabled:            &settings.AuthEnabled,
	}, nil
}

func (r *queryResolver) Variable(ctx context.Context, key string) (*model.Variable, error) {
	var result model.Variable
	variable, err := r.InternalVariableInteractor.GetInternalVariable(key)

	if err == nil {
		result = convertVariable(variable)
	}

	return &result, err
}

func (r *queryResolver) User(ctx context.Context, id *int) (*model.User, error) {
	currentUser := auth.GetUserFromContext(ctx)

	if currentUser.IsDefaultUser {
		defaultUserRoles := viper.GetStringSlice("Users.DefaultUserRoles")
		var roles []business.Role
		for _, userRole := range defaultUserRoles {
			role := business.GetRoleFromString(userRole)
			if !slices.Contains(roles, role) {
				roles = append(roles, role)
			}
		}

		// We are in auth disabled mode, so we return the default user.
		defaultUser := business.User{
			Id:            1,
			Name:          "Default user",
			Roles:         roles,
			IsDefaultUser: true,
		}
		result := convertUser(defaultUser, false)

		return &result, nil
	}

	basicInfoOnly := true
	if id == nil || business.UserHasRole(*currentUser, business.ROLE_ADMIN) {
		basicInfoOnly = false
	}

	// If no id is provided, return the current user.
	var userIdToGet int
	if id == nil {
		userIdToGet = currentUser.Id
	} else {
		userIdToGet = *id
	}

	var result model.User
	user, err := r.UsersInteractor.GetUser(userIdToGet)

	if err == nil {
		result = convertUser(user, basicInfoOnly)
	}

	return &result, err
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	currentUser := auth.GetUserFromContext(ctx)

	var result []*model.User
	users, err := r.UsersInteractor.GetAllUsers()

	if err == nil {
		for _, user := range users {
			gqlUser := convertUser(user, !business.UserHasRole(*currentUser, business.ROLE_ADMIN))
			result = append(result, &gqlUser)
		}
	}

	return result, err
}

func (r *trackResolver) Src(ctx context.Context, obj *model.Track) (string, error) {
	return "/stream/" + strconv.Itoa(obj.ID), nil
}

func (r *trackResolver) Artist(ctx context.Context, obj *model.Track) (*model.Artist, error) {
	// Do not search for artist if track has no artist.
	if obj.ArtistID == 0 {
		return nil, nil
	}

	return GetArtist(ctx, obj.ArtistID)
}

func (r *trackResolver) Album(ctx context.Context, obj *model.Track) (*model.Album, error) {
	// Do not search for album if track has no album.
	if obj.AlbumID == 0 {
		return nil, nil
	}

	return GetAlbum(ctx, obj.AlbumID)
}

func (r *trackResolver) Cover(ctx context.Context, obj *model.Track) (*string, error) {
	if *obj.Cover != 0 {
		coverEndpoint := "/covers/" + strconv.Itoa(*obj.Cover)
		return &coverEndpoint, nil
	}

	return nil, nil
}

// Album returns generated.AlbumResolver implementation.
func (r *Resolver) Album() generated.AlbumResolver { return &albumResolver{r} }

// Artist returns generated.ArtistResolver implementation.
func (r *Resolver) Artist() generated.ArtistResolver { return &artistResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Track returns generated.TrackResolver implementation.
func (r *Resolver) Track() generated.TrackResolver { return &trackResolver{r} }

type albumResolver struct{ *Resolver }
type artistResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type trackResolver struct{ *Resolver }
