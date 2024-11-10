import AutoSidebar from '@jiek/vite-plugin-vitepress-auto-sidebar'

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
        {
          text: i18n.t('quick_start', { lng: lang }),
          link: `/${lang}/quick_start`
        },
        {
          text: i18n.t('references', { lng: lang }),
          link: `/${lang}/references/basic/general`
        },
        {
          text: i18n.t('examples', { lng: lang }),
          link: `/${lang}/examples`
        },
        {
          text: i18n.t('ecosystem', { lng: lang }),
          items: [
            {
              text: `${i18n.t('converters', { lng: lang })} | X to Typp`,
              items: [
                { text: 'ts2tp', link: `/${lang}/todo` },
                { text: 'jsonschema2tp', link: `/${lang}/todo` }
              ]
            },
            {
              text: `${i18n.t('converters', { lng: lang })} | Typp to X`,
              items: [
                { text: 'tp2ts', link: `/${lang}/todo` },
                { text: 'tp2jsonschema', link: `/${lang}/todo` }
              ]
            },
            {
              text: i18n.t('libraries', { lng: lang }),
              items: [
                { text: 'tpform', link: `/${lang}/todo` },
                { text: 'tpui', link: `/${lang}/todo` }
              ]
            },
            {
              text: i18n.t('common_plugins', { lng: lang }),
              items: [
                { text: i18n.t('validator', { lng: lang }), link: `/${lang}/validator` }
              ]
            }
          ]
        },
        {
          text: i18n.t('about', { lng: lang }),
          items: [
            { text: i18n.t('releases', { lng: lang }), link: `/${lang}/releases` },
            { text: 'F&Q', link: `/${lang}/faq` }
          ]
        },
        {
          text: 'Playground',
          link: `/${lang}/playground`
        }
      ],
      docFooter: {
        prev: i18n.t('prev', { lng: lang }),
        next: i18n.t('next', { lng: lang })
      },
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
    ['link', { rel: 'icon', href: '/typp/favicon.svg' }],
    [
      'link',
      {
        href:
          'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        rel: 'stylesheet'
      }
    ],
    [
      'style',
      {},
      `.material-symbols-rounded {
  font-variation-settings:
  'FILL' 0,
  'wght' 300,
  'GRAD' 0,
  'opsz' 24
}`
    ]
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
    },
    plugins: [
      AutoSidebar({
        path: '.',
        titleFromFile: true
      })
    ]
  }
})
