package auth

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
	"golang.org/x/exp/slices"
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

	// Same path as when it was set, otherwise the browser keeps it.
	streamTokenCookie := &http.Cookie{
		Name:     streamTokenCookieName,
		Value:    "",
		Path:     streamTokenCookiePath,
		HttpOnly: true,
		MaxAge:   -1,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, accessTokenCookie)
	http.SetCookie(w, refreshTokenCookie)
	http.SetCookie(w, streamTokenCookie)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
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

const (
	streamTokenCookieName = "stream_token"
	streamTokenCookiePath = "/stream"
)

type userGetter interface {
	GetUser(id int) (business.User, error)
}

// StreamAuthMiddleware guards the media streaming endpoint. Besides the access
// token, it accepts the longer-lived stream token: audio elements fetch the
// stream on their own, without the app being able to refresh an expired access
// token first (e.g. a locked iPad starting the next track).
func StreamAuthMiddleware(users userGetter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if cookie, err := r.Cookie("access_token"); err == nil {
				if user, err := validateCurrentUser(cookie); err == nil {
					next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userCtxKey, &user)))
					return
				}
			}

			cookie, err := r.Cookie(streamTokenCookieName)
			if err != nil {
				http.Error(w, "No authentication token found", http.StatusUnauthorized)
				return
			}

			userID, err := JWTValidateStreamToken(cookie.Value)
			if err != nil {
				http.Error(w, "Authentication failed", http.StatusUnauthorized)
				return
			}

			// A stream token outlives access tokens: make sure the user still exists.
			user, err := users.GetUser(userID)
			if err != nil {
				http.Error(w, "Authentication failed", http.StatusUnauthorized)
				return
			}
			user.Password = ""

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userCtxKey, &user)))
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
		Expires:  time.Now().Add(getAccessTokenExpiration()),
		SameSite: http.SameSiteLaxMode,
	}

	refreshTokenCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    tokens.refresh,
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(getRefreshTokenExpiration()),
		SameSite: http.SameSiteLaxMode,
	}

	// Only sent to the streaming endpoint.
	streamTokenCookie := &http.Cookie{
		Name:     streamTokenCookieName,
		Value:    tokens.stream,
		Path:     streamTokenCookiePath,
		HttpOnly: true,
		Expires:  time.Now().Add(getStreamTokenExpiration()),
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, accessTokenCookie)
	http.SetCookie(w, refreshTokenCookie)
	http.SetCookie(w, streamTokenCookie)
}
