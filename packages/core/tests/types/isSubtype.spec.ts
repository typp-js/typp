import type { IsSubType } from '#~'

import { expectTypeOf, test } from 'vitest'

test('base', () => {
  expectTypeOf<IsSubType<1, number>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<1, 1>>().toEqualTypeOf<true>()

  expectTypeOf<IsSubType<number, 1>>().toEqualTypeOf<never>()

  expectTypeOf<IsSubType<1, 2>>().toEqualTypeOf<never>()
  expectTypeOf<IsSubType<number, string>>().toEqualTypeOf<never>()
  expectTypeOf<IsSubType<string, number>>().toEqualTypeOf<never>()
})
test('never', () => {
  expectTypeOf<IsSubType<never, number>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<number, never>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<never, never>>().toEqualTypeOf<true>()
})
test('unknown', () => {
  expectTypeOf<IsSubType<unknown, number>>().toEqualTypeOf<never>()

  expectTypeOf<IsSubType<number, unknown>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<unknown, unknown>>().toEqualTypeOf<true>()
})
test('never-unknown', () => {
  expectTypeOf<IsSubType<never, unknown>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<unknown, never>>().toEqualTypeOf<true>()
})
test('union', () => {
  expectTypeOf<IsSubType<number, number | string>>().toEqualTypeOf<true>()
  expectTypeOf<IsSubType<number | string, number>>().toEqualTypeOf<true>()

  expectTypeOf<IsSubType<number, 1 | 2>>().toEqualTypeOf<never>()
  expectTypeOf<IsSubType<1 | 2, number>>().toEqualTypeOf<true>()

  expectTypeOf<IsSubType<1, 2 | string>>().toEqualTypeOf<never>()
  expectTypeOf<IsSubType<2 | string, 1>>().toEqualTypeOf<never>()

  expectTypeOf<IsSubType<never, number | Number>>().toEqualTypeOf<true>()
})
