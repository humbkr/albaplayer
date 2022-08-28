package auth

import (
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

var jwtSecret = []byte(getJwtSecret())

func getJwtSecret() string {
	return viper.GetString("Auth.JWTSecret")
}

func JWTGenerate(user business.User) (string, error) {
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
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ACCESS_TOKEN_COOKIE_EXPIRATION)),
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

func JWTValidate(tokenString string) (*jwt.Token, string, error) {
	fmt.Println("JWTValidate")
	jwtToken, err := jwt.ParseWithClaims(tokenString, &JwtCustomClaim{}, func(token *jwt.Token) (interface{}, error) {
		if t, ok := token.Claims.(*JwtCustomClaim); ok && token.Valid {
			return t, nil
		}

		return nil, fmt.Errorf("invalid token")
	})

	if err != nil {
		return nil, "", err
	}

	return jwtToken, tokenString, nil
}
