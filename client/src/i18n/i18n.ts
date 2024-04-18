import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locale_en'
import fr from './locale_fr'

i18n.use(initReactI18next).init({
  debug: process.env.REACT_APP_DEBUG_MODE === 'true',
  fallbackLng: 'en',
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
})

export default i18n
