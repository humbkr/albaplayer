package graph

import (
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/domain"
	"github.com/humbkr/albaplayer/internal/interfaces/graph/model"
)

func convertArtist(artist domain.Artist) model.Artist {
	return model.Artist{
		ID:        artist.Id,
		Name:      artist.Name,
		DateAdded: &artist.DateAdded,
	}
}

func convertAlbum(album domain.Album) model.Album {
	return model.Album{
		ID:        album.Id,
		Title:     album.Title,
		Year:      &album.Year,
		ArtistID:  album.ArtistId,
		Cover:     &album.CoverId,
		DateAdded: &album.DateAdded,
	}
}

func convertTrack(track domain.Track) model.Track {
	return model.Track{
		ID:        track.Id,
		Title:     track.Title,
		Path:      track.Path,
		ArtistID:  track.ArtistId,
		AlbumID:   track.AlbumId,
		Disc:      &track.Disc,
		Number:    &track.Number,
		Duration:  &track.Duration,
		Cover:     &track.CoverId,
		DateAdded: &track.DateAdded,
	}
}

func convertVariable(variable business.InternalVariable) model.Variable {
	return model.Variable{
		Key:   &variable.Key,
		Value: &variable.Value,
	}
}

func convertUser(user business.User, basicInfoOnly bool) model.User {
	var roles []*string
	for _, role := range user.Roles {
		roleAsString := business.GetRoleAsString(role)
		roles = append(roles, &roleAsString)
	}

	if basicInfoOnly {
		return model.User{
			ID:   user.Id,
			Name: &user.Name,
		}
	}

	return model.User{
		ID:        user.Id,
		Name:      &user.Name,
		Email:     &user.Email,
		Password:  &user.Password,
		Data:      &user.Data,
		DateAdded: &user.DateAdded,
		Roles:     roles,
	}
}

func processUserRoles(inputRoles []*string) (roles []business.Role) {
	// If no roles have been given, set default.
	if inputRoles == nil || len(inputRoles) < 1 {
		roles = []business.Role{business.ROLE_LISTENER}
	} else {
		for _, v := range inputRoles {
			roles = append(roles, business.GetRoleFromString(*v))
		}
	}

	// Deduplicate roles.
	allKeys := make(map[business.Role]bool)
	var list []business.Role
	for _, item := range roles {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}

	return list
}
