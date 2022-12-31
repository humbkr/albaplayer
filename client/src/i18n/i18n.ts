import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locale_en'

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
  },
})

export default i18n
