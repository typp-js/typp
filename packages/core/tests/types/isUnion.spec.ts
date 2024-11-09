import type { IsUnion } from '#~/types.ts'
import { expectTypeOf, test } from 'vitest'

test('isUnion', () => {
  expectTypeOf<IsUnion<string>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<string | number>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnion<true>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<true | false>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnion<boolean>>().toEqualTypeOf<true>()

  expectTypeOf<IsUnion<string | {}>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnion<string | object>>().toEqualTypeOf<true>()

  expectTypeOf<IsUnion<string | any>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<string | unknown>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<string | never>>().toEqualTypeOf<false>()
})
