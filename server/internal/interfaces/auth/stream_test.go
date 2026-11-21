package auth

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/humbkr/albaplayer/internal/business"
)

var testUser = business.User{Id: 7, Name: "listener", Roles: []business.Role{business.ROLE_LISTENER}}

type fakeUsers struct {
	users map[int]business.User
}

func (f fakeUsers) GetUser(id int) (business.User, error) {
	user, ok := f.users[id]
	if !ok {
		return business.User{}, errors.New("user not found")
	}

	return user, nil
}

func setTestSecret(t *testing.T) {
	t.Helper()
	previous := jwtSecret
	jwtSecret = []byte("test-secret")
	t.Cleanup(func() { jwtSecret = previous })
}

func signClaims(t *testing.T, claims jwt.Claims) string {
	t.Helper()
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(jwtSecret)
	if err != nil {
		t.Fatal(err)
	}

	return token
}

func expiredStreamToken(t *testing.T) string {
	return signClaims(t, JwtStreamClaim{
		Typ: streamTokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(testUser.Id),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Minute)),
		},
	})
}

func expiredAccessToken(t *testing.T) string {
	return signClaims(t, JwtCustomClaim{
		ID: testUser.Id,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Minute)),
		},
	})
}

func generateTokens(t *testing.T) TokenPair {
	t.Helper()
	tokens, err := JWTGenerateTokenPair(testUser)
	if err != nil {
		t.Fatal(err)
	}

	return tokens
}

func TestJWTValidateStreamToken(t *testing.T) {
	setTestSecret(t)
	tokens := generateTokens(t)

	t.Run("accepts a stream token", func(t *testing.T) {
		userID, err := JWTValidateStreamToken(tokens.stream)
		if err != nil || userID != testUser.Id {
			t.Fatalf("got user %d, err %v; want user %d", userID, err, testUser.Id)
		}
	})

	untypedToken := signClaims(t, JwtStreamClaim{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(testUser.Id),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})
	rejected := map[string]string{
		"an expired stream token":         expiredStreamToken(t),
		"an access token":                 tokens.access,
		"a refresh token":                 tokens.refresh,
		"a token without the stream type": untypedToken,
	}
	for name, token := range rejected {
		t.Run("rejects "+name, func(t *testing.T) {
			if _, err := JWTValidateStreamToken(token); err == nil {
				t.Fatal("expected an error")
			}
		})
	}
}

func TestStreamTokenIsRejectedByOtherValidators(t *testing.T) {
	setTestSecret(t)
	tokens := generateTokens(t)

	if _, _, err := JWTValidateAccessToken(tokens.stream); err == nil {
		t.Error("a stream token must not be accepted as an access token")
	}
	if _, err := JWTValidateRefreshToken(tokens.stream); err == nil {
		t.Error("a stream token must not be accepted as a refresh token")
	}
}

func TestStreamAuthMiddleware(t *testing.T) {
	setTestSecret(t)
	tokens := generateTokens(t)
	users := fakeUsers{users: map[int]business.User{testUser.Id: testUser}}

	cases := []struct {
		name       string
		users      fakeUsers
		cookies    []*http.Cookie
		wantStatus int
	}{
		{
			name:       "valid access token",
			users:      fakeUsers{},
			cookies:    []*http.Cookie{{Name: "access_token", Value: tokens.access}},
			wantStatus: http.StatusOK,
		},
		{
			name:  "expired access token and valid stream token",
			users: users,
			cookies: []*http.Cookie{
				{Name: "access_token", Value: expiredAccessToken(t)},
				{Name: streamTokenCookieName, Value: tokens.stream},
			},
			wantStatus: http.StatusOK,
		},
		{
			name:       "valid stream token of a deleted user",
			users:      fakeUsers{},
			cookies:    []*http.Cookie{{Name: streamTokenCookieName, Value: tokens.stream}},
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "expired stream token",
			users:      users,
			cookies:    []*http.Cookie{{Name: streamTokenCookieName, Value: expiredStreamToken(t)}},
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "refresh token used as stream token",
			users:      users,
			cookies:    []*http.Cookie{{Name: streamTokenCookieName, Value: tokens.refresh}},
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "no token",
			users:      users,
			wantStatus: http.StatusUnauthorized,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if GetUserFromContext(r.Context()) == nil {
					t.Error("expected the user in the request context")
				}
				w.WriteHeader(http.StatusOK)
			})
			request := httptest.NewRequest(http.MethodGet, "/stream/1", nil)
			for _, cookie := range c.cookies {
				request.AddCookie(cookie)
			}
			recorder := httptest.NewRecorder()

			StreamAuthMiddleware(c.users)(next).ServeHTTP(recorder, request)

			if recorder.Code != c.wantStatus {
				t.Fatalf("got status %d, want %d", recorder.Code, c.wantStatus)
			}
		})
	}
}

func findCookie(cookies []*http.Cookie, name string) *http.Cookie {
	for _, cookie := range cookies {
		if cookie.Name == name {
			return cookie
		}
	}

	return nil
}

func TestStreamTokenCookie(t *testing.T) {
	setTestSecret(t)

	t.Run("is set with the other auth cookies, scoped to the streaming endpoint", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		addAuthCookiesToResponse(recorder, generateTokens(t))

		cookie := findCookie(recorder.Result().Cookies(), streamTokenCookieName)
		if cookie == nil {
			t.Fatal("stream token cookie not set")
		}
		if cookie.Path != streamTokenCookiePath || !cookie.HttpOnly {
			t.Errorf("got path %q, httpOnly %v", cookie.Path, cookie.HttpOnly)
		}
		if _, err := JWTValidateStreamToken(cookie.Value); err != nil {
			t.Errorf("cookie does not hold a valid stream token: %v", err)
		}
	})

	t.Run("is cleared on logout, with the path it was set with", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		AuthHandlers{}.Logout(recorder, httptest.NewRequest(http.MethodPost, "/auth/logout", nil))

		cookie := findCookie(recorder.Result().Cookies(), streamTokenCookieName)
		if cookie == nil || cookie.Path != streamTokenCookiePath || cookie.MaxAge >= 0 {
			t.Fatalf("stream token cookie not cleared: %+v", cookie)
		}
	})
}
