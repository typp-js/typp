import type { Collect, IsSameTuple } from '#~/types.ts'

import { expectTypeOf, test } from 'vitest'

test('base', () => {
  expectTypeOf<Collect<[1, 2, true, '3'], number>>()
    .toEqualTypeOf<[1, 2]>()
  expectTypeOf<Collect<[], number>>()
    .toEqualTypeOf<[]>()

  expectTypeOf<Collect<{
    a: 1
    b: 2
    c: true
    d: '3'
  }, number>>().toEqualTypeOf<[1, 2]>()
  expectTypeOf<Collect<{}, number>>().toEqualTypeOf<[]>()

  expectTypeOf<Collect<1 | 2, number>>()
    .toEqualTypeOf<[1, 2]>()
  expectTypeOf<Collect<1 | 2 | '3', number>>()
    .toEqualTypeOf<[1, 2]>()
})

test('nested', () => {
  expectTypeOf<
    IsSameTuple<Collect<[1, 2, '3', 4 | 5], number>, [1, 2, 4, 5]>
  >().toEqualTypeOf<true>()
  expectTypeOf<
    Collect<[[1]], number>
  >().toEqualTypeOf<[1]>()
  expectTypeOf<
    IsSameTuple<Collect<{
      a: 1
      b: 2
      c: '3'
      d: 4 | 5
      e: [6, '7']
    }, number>, [1, 2, 4, 5, 6]>
  >().toEqualTypeOf<true>()

  expectTypeOf<
    IsSameTuple<Collect<{
      a: 1
      b: 2
      c: '3'
      d: number
    }, number>, [1, 2, number]>
  >().toEqualTypeOf<true>()

  expectTypeOf<
    IsSameTuple<Collect<true | 1 | 2 | [3, '4'] | {
      a: 5, b: 6, c: true
    }, number>, [1, 2, 3, 5, 6]>
  >().toEqualTypeOf<true>()
})
