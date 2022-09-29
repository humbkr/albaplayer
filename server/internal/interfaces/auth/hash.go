package auth

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPassword(hashedPassword string, plainTextPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainTextPassword))
}
