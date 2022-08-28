package auth

import (
	"errors"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/humbkr/albaplayer/internal/utils"
	"net/http"
	"time"
)

const ACCESS_TOKEN_COOKIE_EXPIRATION = 10 * time.Minute
const REFRESH_TOKEN_COOKIE_EXPIRATION = 72 * time.Hour

func loginUser(userInteractor *business.UsersInteractor, username string, password string) (string, error) {
	// Check if the user credentials are valid.
	passwordHash, _ := utils.HashPassword(password)
	user, err := userInteractor.UserLogin(username, passwordHash)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token, errToken := JWTGenerate(user)
	if errToken != nil {
		return "", errToken
	}

	return token, nil
}

func validateCurrentUser(authCookie *http.Cookie) (business.User, error) {
	if authCookie == nil {
		return business.User{}, errors.New("no authorization cookie found")
	}

	// Check token is valid.
	token, _, err := JWTValidate(authCookie.Value)
	if err != nil {
		return business.User{}, err
	}

	claims := token.Claims.(*JwtCustomClaim)

	var userRoles []business.Role
	for _, v := range claims.Roles {
		userRoles = append(userRoles, business.GetRoleFromString(v))
	}

	user := business.User{
		Id:        claims.ID,
		Name:      claims.Name,
		Email:     claims.Email,
		Password:  "",
		Data:      "",
		DateAdded: 0,
		Roles:     userRoles,
	}

	return user, nil
}
