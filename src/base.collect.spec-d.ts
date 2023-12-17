import { expectTypeOf, test } from 'vitest'
import { Collect } from './base'

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
  expectTypeOf<Collect<[1, 2, '3', 4 | 5], number>>()
    .toEqualTypeOf<[1, 2, 4, 5]>()
  expectTypeOf<Collect<{
    a: 1
    b: 2
    c: '3'
    d: 4 | 5
    e: [6, '7']
  }, number>>()
    .toEqualTypeOf<[1, 2, 4, 5, 6]>()

  expectTypeOf<Collect<{
    a: 1
    b: 2
    c: '3'
    d: number
  }, number>>()
    .toEqualTypeOf<[1, 2, number]>()

  expectTypeOf<Collect<true | 1 | 2 | [3, '4'] | {
    a: 5, b: 6, c: true
  }, number>>()
    .toEqualTypeOf<[1, 2, 3, 5, 6]>()
})