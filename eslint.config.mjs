import config from '@antfu/eslint-config'

export default config({
  stylistic: false,
  typescript: {
    overrides: {
      'ts/no-namespace': 'off',
      'ts/no-empty-object-type': 'off',
      'ts/method-signature-style': 'off',
      'ts/no-use-before-define': 'off'
    }
  },
  javascript: {
    overrides: {
      'unused-imports/no-unused-vars': 'off'
    }
  }
})
