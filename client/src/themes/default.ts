const themeDefault: AppTheme = {
  // Type of theme.
  isDark: false,

  // Used for all list items.
  itemHeight: '50px',

  backgroundColor: '#ffffff',
  separatorColor: '#efeff2',
  textPrimaryColor: '#000000',
  textSecondaryColor: '#92929d',

  highlight: '#efeff2',
  highlightFocus: '#00bdab',
  textHighlightFocusColor: '#007166',

  cards: {
    backgroundColor: '#eeeeee',
  },

  buttons: {
    height: '32px',
    sidePadding: '16px',
    fontSize: '14px',
    iconSize: 24,
    color: '#009688',
    colorHover: '#00bdab',
    colorDisabled: '#b2b2b2',
    colorLight: '#fff',
  },

  inputs: {
    backgroundColor: '#ffffff',
  },

  messages: {
    info: {
      color: '#00911b',
    },
    warning: {
      color: '#dba00b',
    },
    error: {
      color: '#cb2a2a',
    },
    height: '32px',
  },

  sidebar: {
    width: '280px',
    menuItemHeight: '40px',
    background: '#2a2a2a',
    textPrimaryColor: '#d9d9d9',
    textPrimaryColorHover: '#333333',
    separatorColor: '#3f4248',
  },

  player: {
    buttons: {
      color: '#fff',
      colorHover: '#00bdab',
      colorDisabled: '#92929d',
      colorEnabled: '#00bdab',
    },
    timeline: {
      color: '#747474',
      colorElapsed: '#fff',
    },
  },

  nowPlaying: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    textPrimaryColor: '#ffffff',
    textSecondaryColor: '#92929d',
  },

  dashboard: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    textPrimaryColor: '#ffffff',
    textSecondaryColor: '#92929d',
  },
}

export default themeDefault
