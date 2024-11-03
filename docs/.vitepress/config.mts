import { defineConfig } from 'vitepress'
import type { DefaultTheme, LocaleConfig } from 'vitepress/types/shared'

const i18nDict = {
  'zh-Hans': {
    label: '简体中文',
    'quick-start': '快速开始',
    'references': '参考文档',
    'examples': '示例',
    footerMessage: '基于 MIT 协议发布。',
    notFound: {
      title: '资源不存在',
      quote: '迷路了吗？访问的链接似乎已经失效或不存在，如果有问题可通过社区联系我们。',
      linkLabel: '返回首页'
    }
  },
  en: {
    label: 'English',
    'quick-start': 'Quick Start',
    'references': 'References',
    'examples': 'Examples',
    footerMessage: 'Released under the MIT License.',
    notFound: {
      title: 'Resource Not Found',
      quote:
        'Lost in the middle of nowhere? The link you followed probably broken or does not exist, you can contact us through the community if you have any questions.',
      linkLabel: 'Back to Home'
    }
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
      docFooter: { prev: true, next: true },
      footer: {
        message: i18nDict[lang].footerMessage,
        copyright: 'Copyright © 2024-present YiJie'
      },
      notFound: {
        ...i18nDict[lang].notFound,
        linkText: i18nDict[lang].notFound.linkLabel
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
