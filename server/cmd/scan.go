package cmd

import (
	"fmt"
	"os"

	"github.com/humbkr/albaplayer/internal"
	"github.com/spf13/cobra"
)

func init() {
	scanCmd.Flags().BoolVar(&reset, "reset", false, "Erase the library before scanning the source folder")
	scanCmd.Flags().BoolVar(&force, "force", false, "Force a full rescan, ignoring file modification timestamps")
	rootCmd.AddCommand(scanCmd)
}

var reset bool
var force bool

var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan media library folder",
	Long:  `Scan media library folder specified in alba.yml.`,
	Run: func(cmd *cobra.Command, args []string) {
		libraryInteractor, _, _ := internal.InitApp()

		fmt.Println("Scanning media library, this can take several minutes...")

		if reset {
			libraryInteractor.EraseLibrary()
		}
		libraryInteractor.UpdateLibrary(force)

		fmt.Println("Scan finished.")
		os.Exit(0)
	},
}
