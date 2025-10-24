// Note: do not use or export directly i18n from 'i18next' as it will cause an error in the tsc
// utility: "Error: Debug Failure. False expression."

import { use as i18nextUse, t } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locale_en'
import fr from './locale_fr'

i18nextUse(initReactI18next).init({
  debug: import.meta.env.VITE_DEBUG_MODE === 'true',
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

export default {
  t,
}
