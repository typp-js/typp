import { loader } from '@guolao/vue-monaco-editor'

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs'
  }
})

// observe html lang change and update availableLanguages
new MutationObserver(async () => {
  loader.config({
    'vs/nls': {
      availableLanguages: {
        '*': {
          'zh-Hans': 'zh-cn',
          'zh-Hant': 'zh-tw',
          en: 'en'
        }[document.querySelector('html')?.lang || 'zh-Hans']
      }
    }
  })
}).observe(document.querySelector('html')!, {
  attributes: true,
  attributeFilter: ['lang']
})
