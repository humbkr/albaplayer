import { DefaultTheme } from 'styled-components'

const colors: ThemeColors = {
  background: '#f3f3f3',
  separator: '#e1e1e1',
  textPrimary: '#000',
  textSecondary: '#92929d',
  elementHighlight: '#e1e1e1',
  elementHighlightFocus: '#00bdab',
  elementHighlightFocusTextColor: '#007166',
  cardLightBackground: '#e0dfdf',
  cardDarkBackground: 'rgba(0,0,0,0.65)',
  cardDarkTextPrimary: '#f3f3f3',
  cardDarkTextSecondary: '#92929d',
  disabled: '#b2b2b2',
  success: '#5caa68',
  info: '#019a8b',
  warning: '#dba00b',
  error: '#cb2a2a',
  buttonBackground: '#009688',
  buttonBackgroundHover: '#00bdab',
  buttonText: '#f3f3f3',
  inputBackground: '#f3f3f3',
  sidebarBackground: '#2a2a2a',
  sidebarTextPrimary: '#d9d9d9',
  sidebarTextPrimaryHover: '#333333',
  sidebarSeparator: '#3f4248',
  playerButtonDisabled: '#92929d',
  playerTimeline: '#747474',
  playerTimelineElapsed: '#fff',
}

const themeDefault: DefaultTheme = {
  colors,

  // Type of theme.
  isDark: false,

  layout: {
    // Used for all list items.
    itemHeight: '50px',
    // Max witch for the content area when not full page.
    contentMaxWidth: '1060px',
    sidebarWidth: '280px',
  },

  buttons: {
    height: '32px',
    padding: '0 16px',
    fontSize: '1em',
    iconSize: 24,
    color: colors.buttonText,
    backgroundColor: colors.buttonBackground,
    backgroundColorHover: colors.buttonBackgroundHover,
    backgroundColorDisabled: colors.disabled,
  },

  player: {
    buttons: {
      color: colors.sidebarTextPrimary,
      colorHover: colors.elementHighlightFocus,
      colorDisabled: colors.playerButtonDisabled,
      colorEnabled: colors.elementHighlightFocus,
    },
    timeline: {
      color: colors.playerButtonDisabled,
      colorElapsed: colors.playerTimelineElapsed,
    },
  },

  nowPlaying: {
    backgroundColor: colors.cardDarkBackground,
    textPrimaryColor: colors.cardDarkTextPrimary,
    textSecondaryColor: colors.cardDarkTextSecondary,
  },

  dashboard: {
    backgroundColor: colors.cardDarkBackground,
    textPrimaryColor: colors.cardDarkTextPrimary,
    textSecondaryColor: colors.cardDarkTextSecondary,
  },
}

export default themeDefault
