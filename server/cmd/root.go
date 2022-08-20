package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "alba",
	Short: "Alba is a music library web player.",
	Long:  `Alba is a music library web player.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Use 'alba serve' to serve the application")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
