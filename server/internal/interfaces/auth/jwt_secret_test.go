package auth

import (
	"encoding/base64"
	"errors"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
)

var secretTestUser = business.User{Id: 3, Name: "listener"}

type fakeSecretStore struct {
	variables map[string]string
}

func newFakeSecretStore() *fakeSecretStore {
	return &fakeSecretStore{variables: map[string]string{}}
}

func (s *fakeSecretStore) InternalVariableExists(key string) bool {
	_, ok := s.variables[key]
	return ok
}

func (s *fakeSecretStore) GetInternalVariable(key string) (business.InternalVariable, error) {
	value, ok := s.variables[key]
	if !ok {
		return business.InternalVariable{}, errors.New("not found")
	}

	return business.InternalVariable{Key: key, Value: value}, nil
}

func (s *fakeSecretStore) SaveInternalVariable(entity *business.InternalVariable) error {
	s.variables[entity.Key] = entity.Value
	return nil
}

// Isolates a test from the package secret and the configured one.
func withConfiguredSecret(t *testing.T, configured string) {
	t.Helper()
	previousSecret := jwtSecret
	previousConfig := viper.GetString("Users.JWTSecret")
	jwtSecret = nil
	viper.Set("Users.JWTSecret", configured)
	t.Cleanup(func() {
		jwtSecret = previousSecret
		viper.Set("Users.JWTSecret", previousConfig)
	})
}

func forgeRootToken(t *testing.T, key []byte) string {
	t.Helper()
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, JwtCustomClaim{
		ID:    1,
		Roles: []string{"root", "admin", "listener"},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}).SignedString(key)
	if err != nil {
		t.Fatal(err)
	}

	return token
}

func TestInitJWTSecret(t *testing.T) {
	t.Run("uses the configured secret", func(t *testing.T) {
		withConfiguredSecret(t, "a-configured-secret-that-is-long-enough")
		store := newFakeSecretStore()

		if err := InitJWTSecret(store); err != nil {
			t.Fatal(err)
		}

		if string(jwtSecret) != "a-configured-secret-that-is-long-enough" {
			t.Errorf("got secret %q", jwtSecret)
		}
		if len(store.variables) != 0 {
			t.Error("no secret should be generated when one is configured")
		}
	})

	for name, configured := range map[string]string{
		"no secret is configured":          "",
		"the example secret is configured": exampleJWTSecret,
	} {
		t.Run("generates and stores a secret when "+name, func(t *testing.T) {
			withConfiguredSecret(t, configured)
			store := newFakeSecretStore()

			if err := InitJWTSecret(store); err != nil {
				t.Fatal(err)
			}

			stored := store.variables[generatedJWTSecretKey]
			if string(jwtSecret) != stored {
				t.Fatalf("got secret %q, stored %q", jwtSecret, stored)
			}
			decoded, err := base64.StdEncoding.DecodeString(stored)
			if err != nil || len(decoded) < 32 {
				t.Errorf("generated secret is not 32 random bytes: %q", stored)
			}
		})
	}

	t.Run("reuses the stored secret on the next start", func(t *testing.T) {
		withConfiguredSecret(t, "")
		store := newFakeSecretStore()
		if err := InitJWTSecret(store); err != nil {
			t.Fatal(err)
		}
		firstSecret := string(jwtSecret)

		jwtSecret = nil
		if err := InitJWTSecret(store); err != nil {
			t.Fatal(err)
		}

		if string(jwtSecret) != firstSecret {
			t.Error("the secret changed between starts: every user would be logged out")
		}
	})
}

func TestTokensAreRejectedWithoutASecret(t *testing.T) {
	withConfiguredSecret(t, "")

	if _, err := jwtGenerateAuthToken(secretTestUser); err == nil {
		t.Error("an access token must not be signed with an empty secret")
	}
	if _, err := jwtGenerateRefreshToken(secretTestUser); err == nil {
		t.Error("a refresh token must not be signed with an empty secret")
	}
	if _, _, err := JWTValidateAccessToken(forgeRootToken(t, []byte(""))); err == nil {
		t.Error("an access token must not be verified with an empty secret")
	}
}

// Regression: the secret used to be empty in production, so anyone could
// forge a root token without knowing any secret.
func TestEmptyKeyForgedTokenIsRejected(t *testing.T) {
	withConfiguredSecret(t, "")
	if err := InitJWTSecret(newFakeSecretStore()); err != nil {
		t.Fatal(err)
	}

	if _, _, err := JWTValidateAccessToken(forgeRootToken(t, []byte(""))); err == nil {
		t.Fatal("a token forged with an empty key was accepted")
	}
}
