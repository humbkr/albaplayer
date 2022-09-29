package auth

import (
	"context"
	"errors"
	"github.com/humbkr/albaplayer/internal/business"
	"net/http"
	"time"
)

const ACCESS_TOKEN_EXPIRATION = 10 * time.Minute
const REFRESH_TOKEN_EXPIRATION = 72 * time.Hour

func loginUser(userInteractor *business.UsersInteractor, username string, password string) (TokenPair, error) {
	// Check if the user credentials are valid.
	user, err := userInteractor.UserGetFromUsername(username)
	err = CheckPassword(user.Password, password)

	if err != nil {
		return TokenPair{}, errors.New("invalid credentials")
	}

	return JWTGenerateTokenPair(user)
}

func validateCurrentUser(authCookie *http.Cookie) (business.User, error) {
	if authCookie == nil {
		return business.User{}, errors.New("no authorization cookie found")
	}

	// Check token is valid.
	_, claims, err := JWTValidateAccessToken(authCookie.Value)
	if err != nil {
		return business.User{}, err
	}

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

func refreshToken(userInteractor *business.UsersInteractor, refreshCookie *http.Cookie) (TokenPair, error) {
	if refreshCookie == nil {
		return TokenPair{}, errors.New("no refresh token found")
	}

	// Check token is valid.
	userID, err := JWTValidateRefreshToken(refreshCookie.Value)
	if err != nil {
		return TokenPair{}, err
	}

	// Get user from database.
	user, err := userInteractor.GetUser(userID)
	if err != nil {
		return TokenPair{}, errors.New("no corresponding user found")
	}

	// Regenerate the tokens.
	return JWTGenerateTokenPair(user)
}

func GetUserFromContext(ctx context.Context) *business.User {
	raw, _ := ctx.Value(userCtxKey).(*business.User)
	return raw
}
