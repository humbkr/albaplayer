import 'i18next'
import type en from 'i18n/locale_en'

export declare global {
  type Translation = typeof en
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}
