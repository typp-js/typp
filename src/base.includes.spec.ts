import { expectTypeOf, test } from 'vitest'
import { Includes } from './base'

test('base', () => {
  type T0 = Includes<[1, 2, 3], [1, 2, 3]>
  //   ^?
  expectTypeOf<T0>().toEqualTypeOf<true>()
  type T1 = Includes<[1, 2, 3], [1, 2]>
  //   ^?
  expectTypeOf<T1>().toEqualTypeOf<false>()
  type T2 = Includes<[1, 2, 3], []>
  //   ^?
  expectTypeOf<T2>().toEqualTypeOf<false>()
  type T3 = Includes<[], []>
  //   ^?
  expectTypeOf<T3>().toEqualTypeOf<true>()
  type T4 = Includes<[1], [1, 2]>
  //   ^?
  expectTypeOf<T4>().toEqualTypeOf<true>()
})
