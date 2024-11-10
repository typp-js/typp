import { defineConfig } from 'vitepress'
import type { DefaultTheme, LocaleConfig } from 'vitepress'

import i18n from '../.i18n'

import { extraLibs } from './loadExtraLibs.node'

const localeConfig: LocaleConfig<DefaultTheme.Config> = (
  ['zh-Hans', 'en'] as const
).reduce((config, lang, index) => ({
  ...config,
  [index === 0 ? 'root' : lang]: {
    label: i18n.t('label', { lng: lang }),
    lang,
    link: `/${lang}/`,
    themeConfig: {
      i18nRouting: true,
      nav: [
        ...(['quick_start', 'references', 'examples'] as const).map((key) => ({
          text: i18n.t(key, { lng: lang }),
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
        message: i18n.t('footer_message', { lng: lang }),
        copyright: 'Copyright © 2024-present YiJie'
      },
      notFound: {
        title: i18n.t('not_found.title', { lng: lang }),
        linkLabel: i18n.t('not_found.link_label', { lng: lang })
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
