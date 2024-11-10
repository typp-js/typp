import { defineConfig } from 'vitepress'
import type { DefaultTheme, LocaleConfig } from 'vitepress'

import { extraLibs } from './loadExtraLibs.node'

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

const localeConfig: LocaleConfig<DefaultTheme.Config> = (
  Object.keys(i18nDict) as (keyof typeof i18nDict)[]
).reduce((config, lang, index) => ({
  ...config,
  [index === 0 ? 'root' : lang]: {
    label: i18nDict[lang].label,
    lang,
    link: `/${lang}/`,
    themeConfig: {
      i18nRouting: true,
      nav: [
        ...(['quick-start', 'references', 'examples'] as const).map((key) => ({
          text: i18nDict[lang][key],
          link: `/${lang}/${key}`
        })),
        {
          text: '生态',
          items: [
            {
              text: '转化器',
              items: [
                { text: 'ts2tp', link: `/${lang}/todo` },
                { text: 'tp2ts', link: `/${lang}/todo` },
                { text: 'jsonschema2tp', link: `/${lang}/todo` },
                { text: 'tp2jsonschema', link: `/${lang}/todo` }
              ]
            },
            {
              text: 'UI 工具',
              items: [
                { text: 'tpform', link: `/${lang}/todo` },
                { text: 'tpui', link: `/${lang}/todo` }
              ]
            },
            {
              text: '常用插件',
              items: [
                { text: '验证器', link: `/${lang}/validator` }
              ]
            }
          ]
        },
        {
          text: '关于',
          items: [
            { text: 'Releases', link: `/${lang}/releases` },
            { text: 'F&Q', link: `/${lang}/faq` }
          ]
        },
        {
          text: 'Playground',
          link: `/${lang}/playground`
        }
      ],
      sidebar: {
        [`/${lang}/references/`]: [
          {
            text: '基础能力',
            base: `/${lang}/references/basic/`,
            items: [
              {
                text: '常用类型',
                link: '/general'
              },
              {
                text: '类型运算',
                link: '/compound'
              },
              {
                text: '构造器',
                link: '/constructor'
              },
              {
                text: '函数',
                link: '/function'
              },
              {
                text: '语法简写',
                link: `/shorthand_syntax`
              }
            ]
          },
          {
            text: '进阶',
            base: `/${lang}/references/advanced/`,
            items: [
              {
                text: '泛型与高阶定义',
                link: '/generic'
              },
              {
                text: '扩展性',
                link: '/extensibility'
              },
              {
                text: '可序列化',
                link: '/sealable'
              },
              {
                text: '类型守卫',
                link: '/type_guard'
              }
            ]
          },
          {
            text: '多语言',
            link: `/${lang}/references/i18n`
          }
        ]
      },
      docFooter: { prev: true, next: true },
      search: { provider: 'local' },
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
  base: '/typp/',
  title: 'Typp',
  description: 'TypeScript++',
  lang: 'zh-Hans',
  head: [
    ['link', { rel: 'icon', href: '/typp/favicon.svg' }]
  ],
  locales: localeConfig,
  themeConfig: {
    logo: {
      src: '/favicon.svg',
      alt: 'Typp Home'
    },
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/typp-js/typp'
      }
    ]
  },
  vite: {
    define: {
      __EXTRA_LIBS__: JSON.stringify(extraLibs)
    }
  }
})
