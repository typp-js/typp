import { expect, expectTypeOf, test, vi } from 'vitest'

import { isWhat } from '../../src/utils/isWhat'

test('type guard with `isWhat`', () => {
  const t0 = 'a' as string | number
  const isTrueCall = vi.fn()
  if (isWhat((x, _) => typeof x === 'string' ? x : _)(t0)) {
    isTrueCall()
    expectTypeOf(t0).toEqualTypeOf<string>()
  } else {
    expectTypeOf(t0).toEqualTypeOf<number>()
  }
  expect(isTrueCall).toHaveBeenCalled()

  const t1 = 1 as string | number
  const isFalseCall = vi.fn()
  if (isWhat((x, _) => typeof x === 'string' ? x : _)(t1)) {
    expectTypeOf(t1).toEqualTypeOf<string>()
  } else {
    isFalseCall()
    expectTypeOf(t1).toEqualTypeOf<number>()
  }
  expect(isFalseCall).toHaveBeenCalled()

  const t2 = 'a' as unknown
  const isTrueCall2 = vi.fn()
  if (isWhat((x, _) => typeof x === 'string' ? x : _)(t2)) {
    isTrueCall2()
    expectTypeOf(t2).toEqualTypeOf<string>()
  } else {
    expectTypeOf(t2).toEqualTypeOf<unknown>()
  }
  expect(isTrueCall2).toHaveBeenCalled()

  const t3 = 1 as unknown
  const isFalseCall2 = vi.fn()
  if (isWhat((x, _) => typeof x === 'string' ? x : _)(t3)) {
    expectTypeOf(t3).toEqualTypeOf<string>()
  } else {
    isFalseCall2()
    expectTypeOf(t3).toEqualTypeOf<unknown>()
  }
})
test('typeof primitive and union type when call `array.filter`', () => {
  const t0: (string | number)[] = ['a', 'b', 1, 2]

  const r0 = t0.filter(isWhat((x, _) => typeof x === 'string' ? x : _))
  expect(r0).toEqual(['a', 'b'])
  expectTypeOf(r0).toEqualTypeOf<string[]>()
  t0.filter(isWhat((x, _) => {
    expectTypeOf(x).toEqualTypeOf<string | number>()
    return typeof x === 'string' ? x : _
  }))

  const t1: unknown[] = ['a', 'b', 1, 2, null, undefined]
  const r1 = t1.filter(isWhat((x, _) => typeof x === 'string' ? x : _))
  expect(r1).toEqual(['a', 'b'])
  expectTypeOf(r1).toEqualTypeOf<string[]>()
})
