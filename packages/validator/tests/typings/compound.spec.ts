import { t } from '@typp/core'
import { validatorSkeleton } from '@typp/validator'
import { compoundValidator } from '@typp/validator/typings/compound'
import { literalValidator } from '@typp/validator/typings/literal'
import { booleanValidator } from '@typp/validator/typings/primitive.boolean'
import { numberValidator } from '@typp/validator/typings/primitive.number'
import { stringValidator } from '@typp/validator/typings/primitive.string'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

beforeAll(() => t.use(validatorSkeleton))

describe('compound', () => {
  beforeAll(() => {
    t.use(compoundValidator)
    t.use(literalValidator)
    t.use(stringValidator)
    t.use(numberValidator)
    t.use(booleanValidator)
  })
  describe('union', () => {
    test('base', () => {
      const results = [
        t.union([String]).validate('a'),
        t.union([String, Number]).validate(1),
        t.union([String, Number]).validate('a')
      ] as const
      expect(results).toEqual(['a', 1, 'a'])
      expectTypeOf(results).toEqualTypeOf<
        readonly [
          string,
          string | number,
          string | number
        ]
      >()
    })
    test('boolean', () => {
      const results = [
        t.union([Boolean]).validate(true),
        t.union([Boolean]).validate(false),
        t.union([String, Boolean]).validate(true),
        t.union([String, Boolean]).validate('123'),
        t.union([true]).validate(true),
        t.union([true, false]).validate(true)
      ] as const
      expect(results).toEqual([true, false, true, '123'])
      expectTypeOf(results).toEqualTypeOf<
        readonly [
          boolean,
          boolean,
          string | boolean,
          string | boolean,
          true,
          true | false
        ]
      >()
    })
    test('narrow', () => {
      const results = [
        t.union([String]).validate.narrow('a'),
        t.union([String, Number]).validate.narrow('a'),
        t.union([String, Number]).validate.narrow(1),
        t.union([true]).validate.narrow(true),
        t.union([Boolean]).validate.narrow(true),
        t.union([Boolean]).validate.narrow(false)
      ] as const
      expect(results).toEqual(['a', 'a', 1, true, true, false])
      expectTypeOf(results).toEqualTypeOf<
        readonly ['a', 'a', 1, true, true, false]
      >()
    })
  })
  describe('intersection', () => {
  })
})
