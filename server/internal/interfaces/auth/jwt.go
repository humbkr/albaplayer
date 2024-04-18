package auth

import (
	"errors"
	"fmt"
	"github.com/humbkr/albaplayer/internal/business"
	"github.com/spf13/viper"
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

var jwtSecret = []byte(getJwtSecret())

func getJwtSecret() string {
	return viper.GetString("Auth.JWTSecret")
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
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ACCESS_TOKEN_EXPIRATION)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func jwtGenerateRefreshToken(user business.User) (string, error) {
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	claims := refreshToken.Claims.(jwt.MapClaims)
	claims["ID"] = user.Id
	claims["exp"] = jwt.NewNumericDate(time.Now().Add(REFRESH_TOKEN_EXPIRATION))

	token, err := refreshToken.SignedString(jwtSecret)
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

		return jwtSecret, nil
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

		return jwtSecret, nil
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
