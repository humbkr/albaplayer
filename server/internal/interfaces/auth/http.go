package auth

import (
	"context"
	"encoding/json"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
	"golang.org/x/exp/slices"
	"log"
	"net/http"
	"time"
)

type AuthHandlers struct {
	UserInteractor    *business.UsersInteractor
	LibraryInteractor *business.LibraryInteractor
}

// Login allows a user to login.
func (h AuthHandlers) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	credentials := struct {
		Username string
		Password string
	}{}
	err := decoder.Decode(&credentials)
	if err != nil || credentials.Username == "" || credentials.Password == "" {
		http.Error(w, "missing fields: username or password", http.StatusBadRequest)
		return
	}

	tokens, user, err := loginUser(h.UserInteractor, credentials.Username, credentials.Password)
	if err != nil {
		http.Error(w, "invalid credentials or user not found", http.StatusForbidden)
		return
	}

	addAuthCookiesToResponse(w, tokens)

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	user.Password = ""
	jsonResp, err := json.Marshal(user)
	if err != nil {
		log.Fatalf("Unable to marshall user to JSON. Err: %s", err)
	}
	w.Write(jsonResp)
}

// Logout allows a user to logout.
func (h AuthHandlers) Logout(w http.ResponseWriter, r *http.Request) {
	accessTokenCookie := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   0,
		Expires:  time.Now(),
		SameSite: http.SameSiteLaxMode,
	}

	refreshTokenCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   0,
		Expires:  time.Now(),
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, accessTokenCookie)
	http.SetCookie(w, refreshTokenCookie)
}

// RefreshToken allows a user to refresh its JWT token.
func (h AuthHandlers) RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "No refresh token found", http.StatusBadRequest)
		return
	}

	tokens, errToken := refreshToken(h.UserInteractor, cookie)
	if errToken != nil {
		http.Error(w, "Invalid refresh token", http.StatusBadRequest)
		return
	}

	addAuthCookiesToResponse(w, tokens)

	w.WriteHeader(http.StatusOK)
}

// CreateRootUser returns the auth config.
func (h AuthHandlers) CreateRootUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	credentials := struct {
		Username string
		Password string
	}{}
	err := decoder.Decode(&credentials)
	if err != nil || credentials.Username == "" || credentials.Password == "" {
		http.Error(w, "missing fields: username or password", http.StatusBadRequest)
		return
	}

	_, err = createRootUser(h.UserInteractor, credentials.Username, credentials.Password)
	if err != nil {
		http.Error(w, "unable to create root user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
type contextKey struct {
	name string
}

var userCtxKey = &contextKey{"user"}

// AuthMiddleware decodes a session cookie and packs the session into context.
func AuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("access_token")
			if err != nil {
				http.Error(w, "No authentication token found", http.StatusUnauthorized)
				return
			}

			// Validate and get user.
			user, err := validateCurrentUser(cookie)
			if err != nil {
				http.Error(w, "Authentication failed", http.StatusUnauthorized)
				return
			}

			// Put user in context
			ctx := context.WithValue(r.Context(), userCtxKey, &user)

			// And call the next with our new context.
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// NoAuthMiddleware creates a default user that will be used for subsequent operations.
// if auth is disabled.
func NoAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defaultUserRoles := viper.GetStringSlice("Users.DefaultUserRoles")

			var roles []business.Role
			for _, userRole := range defaultUserRoles {
				role := business.GetRoleFromString(userRole)
				if !slices.Contains(roles, role) {
					roles = append(roles, role)
				}
			}

			// Put user in context
			ctx := context.WithValue(r.Context(), userCtxKey, &business.User{
				Id:            1,
				Name:          "Default user",
				Roles:         roles,
				IsDefaultUser: true,
			})

			// And call the next with our new context.
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func addAuthCookiesToResponse(w http.ResponseWriter, tokens TokenPair) {
	accessTokenCookie := &http.Cookie{
		Name:     "access_token",
		Value:    tokens.access,
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(ACCESS_TOKEN_EXPIRATION),
		SameSite: http.SameSiteLaxMode,
	}

	refreshTokenCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    tokens.refresh,
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(REFRESH_TOKEN_EXPIRATION),
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, accessTokenCookie)
	http.SetCookie(w, refreshTokenCookie)
}
