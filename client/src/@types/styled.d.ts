import 'styled-components'

export declare global {
  type ThemeColors = {
    background: string
    separator: string
    textPrimary: string
    textSecondary: string
    elementHighlight: string
    elementHighlightFocus: string
    elementHighlightFocusTextColor: string
    cardLightBackground: string
    cardDarkBackground: string
    cardDarkTextPrimary: string
    cardDarkTextSecondary: string
    disabled: string
    success: string
    info: string
    warning: string
    error: string
    buttonBackground: string
    buttonBackgroundHover: string
    buttonText: string
    inputBackground: string
    sidebarBackground: string
    sidebarTextPrimary: string
    sidebarTextPrimaryHover: string
    sidebarSeparator: string
    playerButtonDisabled: string
    playerTimeline: string
    playerTimelineElapsed: string
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ThemeColors

    // Type of theme.
    isDark: boolean

    layout: {
      // Used for all list items.
      itemHeight: string
      // Max witch for the content area when not full page.
      contentMaxWidth: string
      sidebarWidth: string
    }

    buttons: {
      height: string
      padding: string
      fontSize: string
      iconSize: number
      color: string
      backgroundColor: string
      backgroundColorHover: string
      backgroundColorDisabled: string
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

    dashboard: {
      backgroundColor: string
      textPrimaryColor: string
      textSecondaryColor: string
    }
  }
}
