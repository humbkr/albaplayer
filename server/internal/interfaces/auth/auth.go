package auth

import (
	"context"
	"errors"
	"github.com/humbkr/albaplayer/internal/business"
	"net/http"
	"time"
)

const ACCESS_TOKEN_EXPIRATION = 10 * time.Minute
const REFRESH_TOKEN_EXPIRATION = 168 * time.Hour

func GetUserFromContext(ctx context.Context) *business.User {
	raw, _ := ctx.Value(userCtxKey).(*business.User)
	return raw
}

func loginUser(userInteractor *business.UsersInteractor, username string, password string) (TokenPair, business.User, error) {
	// Check if the user credentials are valid.
	user, err := userInteractor.UserGetFromUsername(username)
	err = CheckPassword(user.Password, password)

	if err != nil {
		return TokenPair{}, business.User{}, errors.New("invalid credentials")
	}

	tokenPair, err := JWTGenerateTokenPair(user)
	if err != nil {
		return TokenPair{}, business.User{}, errors.New("invalid credentials")
	}

	return tokenPair, user, nil
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

func createRootUser(userInteractor *business.UsersInteractor, username string, password string) (business.User, error) {
	// If the root user already exists, return an error.
	exists := userInteractor.UserExists(1)
	if exists {
		return business.User{}, errors.New("root user already exists")
	}

	// Else create the root user.
	hashedPassword, _ := HashPassword(password)
	rootUser := business.User{
		Name:     username,
		Password: hashedPassword,
		Roles:    []business.Role{business.ROLE_ROOT, business.ROLE_ADMIN, business.ROLE_LISTENER},
	}

	err := userInteractor.SaveUser(&rootUser)
	if err != nil {
		return business.User{}, err
	}

	return rootUser, nil
}
