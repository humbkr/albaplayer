import themeDefault from './default'
import themeDark from './dark'
import themeDarkOrange from './darkOrange'
import { AppTheme } from './types'

interface ThemeDefinition {
  name: string
  config: AppTheme
}

const themes = {
  default: {
    name: 'Default',
    config: themeDefault,
  },
  dark: {
    name: 'Dark',
    config: themeDark,
  },
  darkOrange: {
    name: 'Dark Orange',
    config: themeDarkOrange,
  },
}

export default function getTheme(theme: string): ThemeDefinition | null {
  // @ts-ignore
  return themes[theme]
}

export { themes }
