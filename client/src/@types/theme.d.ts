export declare global {
  export type AppTheme = {
    // Type of theme.
    isDark: boolean

    // Used for all list items.
    itemHeight: string

    backgroundColor: string
    separatorColor: string
    textPrimaryColor: string
    textSecondaryColor: string

    highlight: string
    highlightFocus: string
    textHighlightFocusColor: string

    cards: {
      backgroundColor: string
    }

    buttons: {
      height: string
      sidePadding: string
      fontSize: string
      iconSize: number
      color: string
      colorHover: string
      colorDisabled: string
    }

    inputs: {
      backgroundColor: string
    }

    messages: {
      info: {
        color: string
      }
      warning: {
        color: string
      }
      error: {
        color: string
      }
      height: string
    }

    sidebar: {
      width: string
      menuItemHeight: string
      background: string
      textPrimaryColor: string
      textPrimaryColorHover: string
      separatorColor: string
    }

    player: {
      buttons: {
        color: string
        colorHover: string
        colorDisabled: string
        colorEnabled: string
      }

      timeline: {
        color: string
        colorElapsed: string
      }
    }

    nowPlaying: {
      backgroundColor: string
      textPrimaryColor: string
      textSecondaryColor: string
    }
  }
}
