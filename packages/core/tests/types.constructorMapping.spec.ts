import { expectTypeOf, test } from 'vitest'

import type { ConstructorMapping } from '../src/types'

test('base', () => {
  expectTypeOf<ConstructorMapping<StringConstructor>>()
    .toMatchTypeOf<string>()

  expectTypeOf<ConstructorMapping<NumberConstructor>>()
    .toMatchTypeOf<number>()

  expectTypeOf<ConstructorMapping<MapConstructor, string, number>>()
    .toMatchTypeOf<Map<string, number>>()

  // don't resolve tuple type
  expectTypeOf<ConstructorMapping<[NumberConstructor]>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<[NumberConstructor, StringConstructor]>>()
    .toMatchTypeOf<never>()

  // don't resolve object type
  expectTypeOf<ConstructorMapping<{
    foo: NumberConstructor
  }>>()
    .toMatchTypeOf<never>()

  expectTypeOf<ConstructorMapping<never>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<unknown>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<{}>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<any>>()
    .toMatchTypeOf<never>()
})
