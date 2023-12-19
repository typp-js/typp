import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul'
    },
    include: ['**/tests/**/*.spec.ts'],
    typecheck: {
      include: ['**/tests/**/*.spec.ts']
    }
  }
})
