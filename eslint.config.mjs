import config from '@antfu/eslint-config'

export default config({
  stylistic: false,
  typescript: {
    overrides: {
      'ts/no-namespace': 'off'
    }
  }
})
