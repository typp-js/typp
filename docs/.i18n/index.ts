import i18next from 'i18next'

import en from './en.json'
import zhHans from './zh-Hans.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof zhHans
    }
  }
}

i18next.init({
  lng: 'zh-Hans',
  resources: {
    en: {
      translation: en
    },
    'zh-Hans': {
      translation: zhHans
    }
  }
})

export default i18next
