package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type JwtCustomClaim struct {
	ID    int      `json:"id"`
	Name  string   `json:"name"`
	Email string   `json:"email"`
	Roles []string `json:"roles"`
	jwt.RegisteredClaims
}

type JwtCustomClaimRefresh struct {
	ID  int
	exp float64
}

type TokenPair struct {
	access  string
	refresh string
}

// Example value from alba.yml.example: as good as public, so never used.
const exampleJWTSecret = "arandomstring"

// Shorter secrets can be brute-forced offline from a single captured token.
const recommendedJWTSecretLength = 32

// Internal variable holding the secret generated when none is configured.
const generatedJWTSecretKey = "jwt_secret"

// Set by InitJWTSecret once the configuration is loaded. Tokens are never
// signed nor verified while it is empty: anyone could forge them.
var jwtSecret []byte

type secretStore interface {
	InternalVariableExists(key string) bool
	GetInternalVariable(key string) (business.InternalVariable, error)
	SaveInternalVariable(entity *business.InternalVariable) error
}

// InitJWTSecret loads the JWT signing secret. It must be called after the
// configuration file is loaded, and before serving requests.
//
// Users.JWTSecret is used when configured. Otherwise, so that default
// installs need no configuration, a random secret is generated on first
// start and stored in the database.
func InitJWTSecret(store secretStore) error {
	secret := viper.GetString("Users.JWTSecret")
	if secret != "" && secret != exampleJWTSecret {
		if len(secret) < recommendedJWTSecretLength {
			log.Printf("WARNING: Users.JWTSecret is shorter than %d characters, use a longer random string\n", recommendedJWTSecretLength)
		}
		jwtSecret = []byte(secret)

		return nil
	}

	secret, err := loadOrGenerateSecret(store)
	if err != nil {
		return err
	}
	jwtSecret = []byte(secret)

	return nil
}

func loadOrGenerateSecret(store secretStore) (string, error) {
	if store.InternalVariableExists(generatedJWTSecretKey) {
		variable, err := store.GetInternalVariable(generatedJWTSecretKey)
		if err != nil {
			return "", fmt.Errorf("cannot load the generated JWT secret: %w", err)
		}
		if variable.Value != "" {
			return variable.Value, nil
		}
	}

	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fmt.Errorf("cannot generate a JWT secret: %w", err)
	}
	secret := base64.StdEncoding.EncodeToString(randomBytes)

	if err := store.SaveInternalVariable(&business.InternalVariable{Key: generatedJWTSecretKey, Value: secret}); err != nil {
		return "", fmt.Errorf("cannot save the generated JWT secret: %w", err)
	}
	log.Println("No Users.JWTSecret configured: generated one and stored it in the database")

	return secret, nil
}

func signingKey() ([]byte, error) {
	if len(jwtSecret) == 0 {
		return nil, errors.New("JWT secret is not initialized")
	}

	return jwtSecret, nil
}

func JWTGenerateTokenPair(user business.User) (tokenPair TokenPair, err error) {
	accessToken, err := jwtGenerateAuthToken(user)
	refreshToken, err := jwtGenerateRefreshToken(user)
	if err != nil {
		return
	}

	tokenPair.access = accessToken
	tokenPair.refresh = refreshToken
	return
}

func jwtGenerateAuthToken(user business.User) (string, error) {
	var userRoles []string
	for _, v := range user.Roles {
		userRoles = append(userRoles, business.GetRoleAsString(v))
	}

	claims := JwtCustomClaim{
		user.Id,
		user.Name,
		user.Email,
		userRoles,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(getAccessTokenExpiration())),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	key, err := signingKey()
	if err != nil {
		return "", err
	}
	signedToken, err := token.SignedString(key)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func jwtGenerateRefreshToken(user business.User) (string, error) {
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	claims := refreshToken.Claims.(jwt.MapClaims)
	claims["ID"] = user.Id
	claims["exp"] = jwt.NewNumericDate(time.Now().Add(getRefreshTokenExpiration()))

	key, err := signingKey()
	if err != nil {
		return "", err
	}
	token, err := refreshToken.SignedString(key)
	if err != nil {
		return "", err
	}

	return token, nil
}

func JWTValidateAccessToken(tokenString string) (*jwt.Token, *JwtCustomClaim, error) {
	jwtToken, err := jwt.ParseWithClaims(tokenString, &JwtCustomClaim{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return signingKey()
	})

	if err != nil {
		return nil, nil, err
	}

	claims, ok := jwtToken.Claims.(*JwtCustomClaim)
	if !ok || !jwtToken.Valid {
		return nil, nil, fmt.Errorf("Invalid token")
	}

	return jwtToken, claims, nil
}

func JWTValidateRefreshToken(tokenString string) (int, error) {
	jwtToken, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return signingKey()
	})

	if err != nil {
		return 0, err
	}

	claims, ok := jwtToken.Claims.(jwt.MapClaims)
	if !ok || !jwtToken.Valid {
		return 0, errors.New("invalid refresh token")
	}

	userID, ok := claims["ID"].(float64)
	if !ok {
		return 0, errors.New("invalid user id")
	}

	return int(userID), nil
}
