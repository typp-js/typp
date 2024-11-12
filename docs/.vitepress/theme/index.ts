import './index.css'

import DefaultTheme from 'vitepress/theme'

if (!import.meta.env.SSR) {
  import('./index.client')
}

export default {
  extends: DefaultTheme
}
