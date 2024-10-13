import type { Pipes } from '#~/types.ts'

import { expectTypeOf, test } from 'vitest'

test('base', () => {
  const fn: Pipes = (() => {}) as any

  const x = fn(() => 1 as const, prev => {
    expectTypeOf(prev).toEqualTypeOf<1>()
    return `${prev}` as const
  })
  expectTypeOf<typeof x>().toEqualTypeOf<'1'>()

  const y = fn(
    () => 1 as const,
    prev => {
      expectTypeOf(prev).toEqualTypeOf<1>()
      return `${prev}` as const
    },
    prev => {
      expectTypeOf(prev).toEqualTypeOf<'1'>()
      return 1 as const
    }
  )
  expectTypeOf<typeof y>().toEqualTypeOf<1>()
})
