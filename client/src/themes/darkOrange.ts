const themeDark: AppTheme = {
  // Type of theme.
  isDark: true,

  // Used for all list items.
  itemHeight: '50px',

  // Max witch for the content area when not full page.
  contentMaxWidth: '1060px',

  backgroundColor: '#323638',
  separatorColor: '#292c2f',
  textPrimaryColor: '#eeeeee',
  textSecondaryColor: '#92929d',

  highlight: '#202124',
  highlightFocus: '#e96a38',
  textHighlightFocusColor: '#a53408',

  cards: {
    backgroundColor: '#4c5052',
  },

  buttons: {
    height: '32px',
    sidePadding: '16px',
    fontSize: '14px',
    iconSize: 24,
    color: '#e96a38',
    colorHover: '#f97c4b',
    colorDisabled: '#b2b2b2',
    colorLight: '#eeeeee',
  },

  inputs: {
    backgroundColor: '#eeeeee',
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
      color: '#eeeeee',
      colorHover: '#f97c4b',
      colorDisabled: '#92929d',
      colorEnabled: '#f97c4b',
    },
    timeline: {
      color: '#747474',
      colorElapsed: '#fff',
    },
  },

  nowPlaying: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    textPrimaryColor: '#eeeeee',
    textSecondaryColor: '#92929d',
  },

  dashboard: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    textPrimaryColor: '#ffffff',
    textSecondaryColor: '#92929d',
  },
}

export default themeDark
