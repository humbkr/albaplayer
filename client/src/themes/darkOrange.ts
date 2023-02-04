import { DefaultTheme } from 'styled-components'

const colors: ThemeColors = {
  background: '#323638',
  separator: '#292c2f',
  textPrimary: '#eee',
  textSecondary: '#92929d',
  elementHighlight: '#202124',
  elementHighlightFocus: '#e96a38',
  elementHighlightFocusTextColor: '#a53408',
  cardLightBackground: '#4c5052',
  cardDarkBackground: 'rgba(0,0,0,0.65)',
  cardDarkTextPrimary: '#f3f3f3',
  cardDarkTextSecondary: '#92929d',
  disabled: '#b2b2b2',
  success: '#5caa68',
  info: '#e96a38',
  warning: '#dba00b',
  error: '#cb2a2a',
  buttonBackground: '#e96a38',
  buttonBackgroundHover: '#f97c4b',
  buttonText: '#f3f3f3',
  inputBackground: '#eee',
  sidebarBackground: '#2a2a2a',
  sidebarTextPrimary: '#d9d9d9',
  sidebarTextPrimaryHover: '#333333',
  sidebarSeparator: '#3f4248',
  playerButtonDisabled: '#92929d',
  playerTimeline: '#747474',
  playerTimelineElapsed: '#fff',
}

const themeDark: DefaultTheme = {
  colors,

  // Type of theme.
  isDark: true,

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

export default themeDark
