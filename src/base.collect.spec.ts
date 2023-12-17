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

  expectTypeOf<Collect<1 | 2 | '3', number>>()
    .toEqualTypeOf<[1, 2]>()

  expectTypeOf<Collect<true | 1 | 2 | [3, '4'] | {
    a: 5, b: 6, c: true
  }, number>>()
    .toEqualTypeOf<[1, 2, 3, 5, 6]>()
})
