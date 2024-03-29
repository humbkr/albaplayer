const themeDark: AppTheme = {
  // Type of theme.
  isDark: true,

  // Used for all list items.
  itemHeight: '50px',

  backgroundColor: '#323638',
  separatorColor: '#292c2f',
  textPrimaryColor: '#eee',
  textSecondaryColor: '#92929d',

  highlight: '#202124',
  highlightFocus: '#019a8b',
  textHighlightFocusColor: '#00665c',

  cards: {
    backgroundColor: '#4c5052',
  },

  buttons: {
    height: '32px',
    sidePadding: '16px',
    fontSize: '14px',
    iconSize: 24,
    color: '#019a8b',
    colorHover: '#00bdab',
    colorDisabled: '#b2b2b2',
    colorLight: '#eeeeee',
  },

  inputs: {
    backgroundColor: '#eee',
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
      color: '#eee',
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
    textPrimaryColor: '#eee',
    textSecondaryColor: '#92929d',
  },

  dashboard: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    textPrimaryColor: '#ffffff',
    textSecondaryColor: '#92929d',
  },
}

export default themeDark
