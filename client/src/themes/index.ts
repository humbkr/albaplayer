import { DefaultTheme } from 'styled-components'
import themeDarkGreen from 'themes/darkGreen'
import themeLight from 'themes/lightGreen'
import themeDarkOrange from './darkOrange'

type ThemeDefinition = {
  name: string
  config: DefaultTheme
}

const themes = {
  default: {
    name: 'Dark Green',
    config: themeDarkGreen,
  },
  darkOrange: {
    name: 'Dark Orange',
    config: themeDarkOrange,
  },
  light: {
    name: 'Light Green',
    config: themeLight,
  },
}

export default function getTheme(theme: keyof typeof themes): ThemeDefinition {
  return themes[theme] || themes.default
}

export { themes }
