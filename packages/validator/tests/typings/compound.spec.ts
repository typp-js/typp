import { t } from '@typp/core'
import type { Pretty } from '@typp/core/types'
import { ValidateError, validatorSkeleton } from '@typp/validator'
import { compoundValidator } from '@typp/validator/typings/compound'
import { literalValidator } from '@typp/validator/typings/literal'
import { booleanValidator } from '@typp/validator/typings/primitive.boolean'
import { numberValidator } from '@typp/validator/typings/primitive.number'
import { stringValidator } from '@typp/validator/typings/primitive.string'
import { structuralValidator } from '@typp/validator/typings/structural'
import { beforeAll, describe, expect, expectTypeOf, test, vi } from 'vitest'

beforeAll(() => t.use(validatorSkeleton))

describe('compound', () => {
  beforeAll(() => {
    t.use(compoundValidator)
    t.use(literalValidator)
    t.use(booleanValidator)
    t.use(stringValidator)
    t.use(numberValidator)
    t.use(structuralValidator)
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
    test('unexpected', () => {
      const skm = t.union([String, Number])
      const caught = vi.fn()
      try {
        // @ts-expect-error
        skm.validate(true)
      } catch (e) {
        caught()
        expect(e).toBeInstanceOf(ValidateError)
        expect(e).property('type').equal('unexpected')
        expect(e).property('actual').equal(true)
        expect(e).property('expected').equal(skm)
      }
      expect(caught).toHaveBeenCalled()
    })
  })
  describe('intersection', () => {
    test('base', () => {
      const results = [
        t.intersection([t({ a: String })]).validate({ a: 'a' }),
        t.intersection([t({ a: String }), t({ b: Number })]).validate({ a: 'a', b: 1 })
      ] as const
      expect(results).toEqual([
        { a: 'a' },
        { a: 'a', b: 1 }
      ])
      type MapPretty<T> = { [K in keyof T]: Pretty<T[K]> }
      expectTypeOf<MapPretty<typeof results>>().toEqualTypeOf<
        readonly [
          { a: string },
          { a: string; b: number }
        ]
      >()
    })
    test('unexpected', () => {
      const aSkm = t({ a: String })
      const bSkm = t({ b: Number })
      const skm = t.intersection([aSkm, bSkm])
      const caught = vi.fn()
      try {
        // @ts-expect-error
        skm.validate({ a: 1 })
      } catch (e) {
        caught()
        expect(e).toBeInstanceOf(ValidateError)
        expect(e).property('type').equal('unexpected')
        expect(e).property('actual').deep.equal({ a: 1 })
        expect(e).property('keyword').equal('ValidateError:intersection not match')
        expect(e).property('expected').equal(skm)
        const [errors] = (e as { args: t.ErrorArgsMap['ValidateError:intersection not match'] }).args
        expect(errors).toHaveLength(2)
        const [[skm0, error0], [skm1, error1]] = errors
        expect(skm0).toBe(aSkm)
        expect(skm1).toBe(bSkm)
        expect(error0).toBeInstanceOf(ValidateError)
        expect(error0).property('type').equal('partially match')
        expect(error0).property('actual').deep.equal({ a: 1 })
        expect(error0).property('expected').equal(aSkm)
        expect(error0).property('keyword').equal('ValidateError:not match the properties')
        expect(error1).toBeInstanceOf(ValidateError)
        expect(error1).property('type').equal('partially match')
        expect(error1).property('actual').deep.equal({ a: 1 })
        expect(error1).property('expected').equal(bSkm)
        expect(error1).property('keyword').equal('ValidateError:is missing properties')
      }
      expect(caught).toHaveBeenCalled()
    })
  })
})
