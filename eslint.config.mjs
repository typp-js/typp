import config from '@antfu/eslint-config'

export default config({
  stylistic: false,
  typescript: {
    overrides: {
      'ts/no-namespace': 'off',
      'ts/no-empty-object-type': 'off',
      'ts/method-signature-style': 'off',
      'ts/no-use-before-define': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/no-wrapper-object-types': 'off',
      'import/no-mutable-exports': 'off'
    }
  },
  javascript: {
    overrides: {
      'unused-imports/no-unused-vars': 'off'
    }
  },
  test: {
    overrides: {
      'test/consistent-test-it': 'off'
    }
  }
})
