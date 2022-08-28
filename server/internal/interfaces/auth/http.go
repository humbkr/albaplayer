package auth

import (
	"context"
	"encoding/json"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
	"net/http"
)

type credentials struct {
	username string
	password string
}

type AuthHandlers struct {
	UserInteractor *business.UsersInteractor
}

// Login allows a user to login.
func (h AuthHandlers) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}

	credentials := &credentials{}
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		http.Error(w, "missing fields: username or password", http.StatusBadRequest)
		return
	}

	token, err := loginUser(h.UserInteractor, credentials.username, credentials.password)
	if err != nil {
		http.Error(w, "invalid credentials or user not found", http.StatusForbidden)
		return
	}

	accessTokenCookie := &http.Cookie{
		Name:     "access_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		MaxAge:   int(ACCESS_TOKEN_COOKIE_EXPIRATION.Seconds()),
	}

	http.SetCookie(w, accessTokenCookie)
}

// Logout allows a user to logout.
func (h AuthHandlers) Logout(w http.ResponseWriter, r *http.Request) {
	panic("TODO implement")
}

// RefreshToken allows a user to refresh its JWT token.
func (h AuthHandlers) RefreshToken(w http.ResponseWriter, r *http.Request) {
	panic("TODO implement")
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
			if viper.GetBool("Auth.Disable") {
				// Authentication disabled.
				next.ServeHTTP(w, r)
				return
			}

			cookie, err := r.Cookie("auth-cookie")

			// Allow unauthenticated users in.
			if err != nil || cookie == nil {
				next.ServeHTTP(w, r)
				return
			}

			// Validate and get user.
			user, err := validateCurrentUser(cookie)
			if err != nil {
				http.Error(w, "Authentication failed", http.StatusForbidden)
				return
			}

			// Put user in context
			ctx := context.WithValue(r.Context(), userCtxKey, user)

			// And call the next with our new context.
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
