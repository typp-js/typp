import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul'
    },
    typecheck: {
      include: ['**/src/**/*.spec.ts']
    }
  }
})
