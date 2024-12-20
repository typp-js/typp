import { t } from '@typp/core'
import { validatorSkeleton } from '@typp/validator/base'
import { isWhatError, ValidateError } from '@typp/validator/error'
import { numberValidator } from '@typp/validator/typings/primitive.number'
import { stringValidator } from '@typp/validator/typings/primitive.string'
import { symbolValidator } from '@typp/validator/typings/primitive.symbol'
import { arrayValidator, objectValidator } from '@typp/validator/typings/structural'
import { beforeAll, describe, expect, expectTypeOf, test, vi } from 'vitest'

beforeAll(() => t.use(validatorSkeleton))

describe('array', () => {
  beforeAll(() =>
    t.use(ctx => {
      ctx.use(arrayValidator)
      ctx.use(stringValidator)
    })
  )
  test('base', () => {
    const t0 = t(Array, String)

    const output0 = t0.validate([''])
    expect(output0).toEqual([''])
    expectTypeOf(output0).toEqualTypeOf<string[]>()

    const output1 = t0.validate(['', ''])
    expect(output1).toEqual(['', ''])
    expectTypeOf(output1).toEqualTypeOf<string[]>()

    const isCatched = vi.fn()
    try {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t0.validate([1])
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:item of array not match')) {
        expectTypeOf(e.args).toEqualTypeOf<[number, ValidateError]>()
        const [index, detailError] = e.args
        expect(index).toBe(0)
        expect(detailError).toBeInstanceOf(ValidateError)
        expect(detailError.type).toEqual('unexpected')
        expect(detailError.actual).toEqual(1)
      } else {
        throw new Error('The error should be ValidateError:tuple length not match')
      }
    }
  })
  test('empty', () => {
    const t0 = t(Array)

    const output = t0.validate([])
    expect(output).toEqual([])
    expectTypeOf(output).toEqualTypeOf<any[]>()
  })
  describe('transform', () => {
    test('falsy', () => {
      const t0 = t(Array, String)
      const output = t0.parse(null)
      expect(output).toEqual([])
      expectTypeOf(output).toEqualTypeOf<string[]>()
    })
    test('array-like', () => {
      const t0 = t(Array, String)

      const output0 = t0.parse({ length: 0 })
      expect(output0).toEqual([])
      expectTypeOf(output0).toEqualTypeOf<string[]>()

      const output1 = t0.parse({ length: 1, 0: 'foo' })
      expect(output1).toEqual(['foo'])
      expectTypeOf(output1).toEqualTypeOf<string[]>()

      const output2 = t0.parse({ length: 1 })
      expect(output2).toEqual(['undefined'])
      expectTypeOf(output2).toEqualTypeOf<string[]>()
    })
  })
})
describe('tuple', () => {
  beforeAll(() =>
    t.use(ctx => {
      ctx.use(arrayValidator)
      ctx.use(stringValidator)
    })
  )
  test('base', () => {
    const t0 = t([String])
    const output = t0.validate([''])
    expect(output).toEqual([''])
    expectTypeOf(output).toEqualTypeOf<[string]>()

    const isCatched = vi.fn()
    try {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t0.validate([1])
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:item of array not match')) {
        expectTypeOf(e.args).toEqualTypeOf<[number, ValidateError]>()
        const [index, detailError] = e.args
        expect(index).toBe(0)
        expect(detailError).toBeInstanceOf(ValidateError)
        expect(detailError.type).toEqual('unexpected')
        expect(detailError.actual).toEqual(1)
      } else {
        throw new Error('The error should be ValidateError:tuple length not match')
      }
    }
    expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
  })
  test('empty', () => {
    const t0 = t([])

    const output = t0.validate([])
    expect(output).toEqual([])
    expectTypeOf(output).toEqualTypeOf<[]>()
  })
  test('length is not match', () => {
    const t0 = t([String])
    try {
      // @ts-expect-error - TS2345: Argument of type [string, number] is not assignable to parameter of type [string]
      // Source has 2 element(s) but target allows only 1
      t0.validate(['', 1])
    } catch (e) {
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:tuple length not match')) {
        expect(e.args).toEqual([1, 2])
        expectTypeOf(e.args).toEqualTypeOf<[number, number]>()
      } else {
        throw new Error('The error should be ValidateError:tuple length not match')
      }
    }
  })
  describe('transform', () => {
    test('falsy', () => {
      const t0 = t([])

      const output0 = t0.parse(null)
      expect(output0).toEqual([])
      expectTypeOf(output0).toEqualTypeOf<[]>()

      const isCatched = vi.fn()
      try {
        t([String]).parse(null)
      } catch (e) {
        isCatched()
        expect(e).toBeInstanceOf(ValidateError)
        expect(e).toHaveProperty('message', 'Data is partially match')
        if (isWhatError(e, 'ValidateError:tuple length not match')) {
          expect(e.args).toEqual([1, 0])
          expectTypeOf(e.args).toEqualTypeOf<[number, number]>()
        } else {
          throw new Error('The error should be ValidateError:tuple length not match')
        }
      }
      expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
    })
    test('array-like', () => {
      const t0 = t([String])

      const output0 = t0.parse({ length: 1, 0: 'foo' })
      expect(output0).toEqual(['foo'])
      expectTypeOf(output0).toEqualTypeOf<[string]>()

      const isCatched = vi.fn()
      try {
        t0.parse({ length: 0 })
      } catch (e) {
        isCatched()
        expect(e).toBeInstanceOf(ValidateError)
        expect(e).toHaveProperty('message', 'Data is partially match')
        if (isWhatError(e, 'ValidateError:tuple length not match')) {
          expect(e.args).toEqual([1, 0])
          expectTypeOf(e.args).toEqualTypeOf<[number, number]>()
        } else {
          throw new Error('The error should be ValidateError:tuple length not match')
        }
      }
      expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
    })
  })
})
describe('interface', () => {
  beforeAll(() =>
    t.use(ctx => {
      ctx.use(objectValidator)
      ctx.use(stringValidator)
      ctx.use(numberValidator)
    })
  )
  test('base', () => {
    const t0 = t({ foo: String })
    const output = t0.validate({ foo: '' })
    expect(output).toEqual({ foo: '' })
    expectTypeOf(output).toEqualTypeOf<{ foo: string }>()
  })
  test('missing properties', () => {
    const isCatched = vi.fn()
    try {
      // @ts-expect-error - TS2322: Argument of type {} is not assignable to parameter of type { foo: string }
      t({ foo: String }).validate({})
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:is missing properties')) {
        const [count, properties] = e.args
        expect(count).toBe(1)
        expect(properties).toHaveLength(1)
        const [key, property] = properties[0]
        expect(key).toBe('foo')
        expect(property.shape).toBe(String)
        expectTypeOf(e.args).toEqualTypeOf<[number, (readonly [string | symbol, t.Schema<unknown, unknown>])[]]>()
      } else {
        throw new Error('The error should be ValidateError:is missing properties')
      }
    }
    expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
    isCatched.mockReset()
    try {
      // @ts-expect-error - TS2322: Argument of type {} is not assignable to parameter of type { foo: string, bar: number }
      t({ foo: String, bar: Number }).validate({})
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:is missing properties')) {
        const [count, properties] = e.args
        expect(count).toBe(2)
        expect(properties).toHaveLength(2)
        const [key0, property0] = properties[0]
        expect(key0).toBe('foo')
        expect(property0.shape).toBe(String)
        const [key1, property1] = properties[1]
        expect(key1).toBe('bar')
        expect(property1.shape).toBe(Number)
        expectTypeOf(e.args).toEqualTypeOf<[number, (readonly [string | symbol, t.Schema<unknown, unknown>])[]]>()
      } else {
        throw new Error('The error should be ValidateError:is missing properties')
      }
    }
    expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
  })
  test('not match the properties', () => {
    const isCatched = vi.fn()
    try {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t({ foo: String }).validate({ foo: 1 })
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:not match the properties')) {
        const [count, properties] = e.args
        expect(count).toBe(1)
        expect(properties).toHaveLength(1)
        const [key, error] = properties[0]
        expect(key).toBe('foo')
        expect(error).toBeInstanceOf(ValidateError)
        expect(error.type).toBe('unexpected')
        expect(error.actual).toBe(1)
        expectTypeOf(e.args).toEqualTypeOf<[number, (readonly [string | symbol, ValidateError])[]]>()
      } else {
        throw new Error('The error should be ValidateError:not match the properties')
      }
    }
    expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
    isCatched.mockReset()
    try {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t({ foo: String, bar: Number }).validate({ foo: 1, bar: '2' })
    } catch (e) {
      isCatched()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:not match the properties')) {
        const [count, properties] = e.args
        expect(count).toBe(2)
        expect(properties).toHaveLength(2)
        const [key0, error0] = properties[0]
        expect(key0).toBe('foo')
        expect(error0).toBeInstanceOf(ValidateError)
        expect(error0.type).toBe('unexpected')
        expect(error0.actual).toBe(1)
        const [key1, error1] = properties[1]
        expect(key1).toBe('bar')
        expect(error1).toBeInstanceOf(ValidateError)
        expect(error1.type).toBe('unexpected')
        expect(error1.actual).toBe('2')
        expectTypeOf(e.args).toEqualTypeOf<[number, (readonly [string | symbol, ValidateError])[]]>()
      } else {
        throw new Error('The error should be ValidateError:not match the properties')
      }
    }
    expect(isCatched, 'Not catched ValidateError as expected').toHaveBeenCalled()
  })
})
describe('record', () => {
  beforeAll(() =>
    t.use(ctx => {
      ctx.use(objectValidator)
      ctx.use(stringValidator)
      ctx.use(numberValidator)
      ctx.use(symbolValidator)
    })
  )
  test('base', () => {
    const t0 = t(Object, String, Number)
    expect(t0.validate({ foo: 1 })).toEqual({ foo: 1 })
    expectTypeOf(t0.validate({ foo: 1 })).toEqualTypeOf<Record<string, number>>()
    const isCaught = vi.fn()
    const input = { foo: '1' }
    try {
      t0.validate(
        // @ts-expect-error - TS2345: Argument of type { foo: string; } is not assignable to parameter of type { [x: string]: number; }
        input
      )
    } catch (e) {
      isCaught()
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).property('message').eq('Data is partially match')
      expect(e).property('type').eq('partially match')
      expect(e).property('actual').eq(input)
      expect(e).property('keyword').eq('ValidateError:not match the properties')
      expect((e as ValidateError).args)
        .toMatchSnapshot()
    }
    expect(isCaught, 'Not caught ValidateError as expected').toHaveBeenCalled()
    // TODO t Object
    // TODO t Object, String
    // TODO t Object, Symbol, Number
    // TODO t Object, Number, String
    // TODO t Object, Number | String
    // TODO t Object, 'foo' | 'bar' | 1
  })
})
describe('dictionary', () => {})
