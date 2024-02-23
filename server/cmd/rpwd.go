package cmd

import (
	"fmt"
	"github.com/humbkr/albaplayer/internal"
	"github.com/humbkr/albaplayer/internal/interfaces/auth"
	"math/rand"
	"os"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(rpwdCmd)
}

var rpwdCmd = &cobra.Command{
	Use:   "rpwd",
	Short: "Reset a user password",
	Long:  `Reset a user password with a new one.`,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		_, usersInteractor, _ := internal.InitApp()

		// Find user.
		userId, err := strconv.Atoi(args[0])
		if err != nil {
			fmt.Println(fmt.Errorf("invalid user id: %s", args[1]))
			os.Exit(1)
		}

		user, err := usersInteractor.GetUser(userId)
		if err != nil {
			fmt.Println(fmt.Errorf("no user found for this id: %d", userId))
			os.Exit(1)
		}

		// Generate new password.
		newPassword := generatePassword(12, 1, 1, 1)
		hashedPassword, err := auth.HashPassword(newPassword)
		if err != nil {
			fmt.Println("cannot generate new password")
			os.Exit(1)
		}

		// Update current user password.
		user.Password = hashedPassword
		err = usersInteractor.SaveUser(&user)
		if err != nil {
			fmt.Println("failed to update user password")
			os.Exit(1)
		}

		// Give it to the user.
		// TODO: Implement something more secure.
		fmt.Println("New password: " + newPassword)
		os.Exit(0)
	},
}

func generatePassword(passwordLength, minSpecialChar, minNum, minUpperCase int) string {
	var (
		lowerCharSet   = "abcdedfghijklmnopqrstuvwxyz"
		upperCharSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		specialCharSet = "!@#$%&*:?"
		numberSet      = "0123456789"
		allCharSet     = lowerCharSet + upperCharSet + specialCharSet + numberSet
	)

	var password strings.Builder

	// Set special character.
	for i := 0; i < minSpecialChar; i++ {
		random := rand.Intn(len(specialCharSet))
		password.WriteString(string(specialCharSet[random]))
	}

	// Set numeric.
	for i := 0; i < minNum; i++ {
		random := rand.Intn(len(numberSet))
		password.WriteString(string(numberSet[random]))
	}

	// Set uppercase.
	for i := 0; i < minUpperCase; i++ {
		random := rand.Intn(len(upperCharSet))
		password.WriteString(string(upperCharSet[random]))
	}

	remainingLength := passwordLength - minSpecialChar - minNum - minUpperCase
	for i := 0; i < remainingLength; i++ {
		random := rand.Intn(len(allCharSet))
		password.WriteString(string(allCharSet[random]))
	}
	inRune := []rune(password.String())
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})

	return string(inRune)
}
