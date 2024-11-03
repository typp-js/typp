import { defineConfig } from 'vitepress'
import type { DefaultTheme, LocaleConfig } from 'vitepress/types/shared'

const i18nDict = {
  'zh-Hans': {
    label: '简体中文',
    'quick-start': '快速开始',
    'references': '参考文档',
    'examples': '示例',
    footerMessage: '基于 MIT 协议发布。'
  },
  en: {
    label: 'English',
    'quick-start': 'Quick Start',
    'references': 'References',
    'examples': 'Examples',
    footerMessage: 'Released under the MIT License.'
  }
}

const localeConfig: LocaleConfig<DefaultTheme.Config> = Object.keys(i18nDict).reduce((config, lang, index) => ({
  ...config,
  [index === 0 ? 'root' : lang]: {
    label: i18nDict[lang].label,
    lang,
    link: `/${lang}/`,
    themeConfig: {
      i18nRouting: true,
      nav: ['quick-start', 'references', 'examples']
        .map((key) => ({ text: i18nDict[lang][key], link: `/${lang}/${key}` })),
      footer: {
        message: i18nDict[lang].footerMessage,
        copyright: 'Copyright © 2024-present YiJie'
      }
    }
  } as LocaleConfig<DefaultTheme.Config>[string]
}), {})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Typp',
  description: 'TypeScript++',
  lang: 'zh-Hans',
  locales: localeConfig,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/typp-js/typp'
      }
    ]
  }
})
