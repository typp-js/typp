import type { Replace } from '#~/types.ts'

import { expectTypeOf, test } from 'vitest'

test('base', () => {
  //   _?
  type T0 = Replace<
    1 | 2 | 3, [
      [1, '1'],
      [2, true],
    ]
  >
  expectTypeOf<T0>().toEqualTypeOf<'1' | true | 3>()
  //   _?
  type T1 = Replace<
    [1, 2 | 3], [
      [1, '1'],
      [2, true],
    ]
  >
  expectTypeOf<T1>().toEqualTypeOf<['1', true | 3]>()
  type T10 = Replace<[1 | 2], [[1, '1']]>
  //   ^?
  expectTypeOf<T10>().toEqualTypeOf<[2 | '1']>()
  //   _?
  type T2 = Replace<
    {
      a: 1
      b: 2 | 3
      c: [1, 2 | 3]
      d: 'd'
    }, [
      [1, '1'],
      [2, true],
      ['d', 'e']
    ]
  >
  expectTypeOf<T2>().toEqualTypeOf<{
    a: '1'
    b: true | 3
    c: ['1', true | 3]
    d: 'e'
  }>()
})
