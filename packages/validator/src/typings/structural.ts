import type { t as tn } from '@typp/core/base'
import type { IsArray, IsEqual, IsInterface, Switch, SwitchOtherEntry } from '@typp/core/types'
import type {} from '@typp/core/consumers/array'
import type {} from '@typp/core/consumers/object'
import { FALSY } from '@typp/validator/constants'
import type {} from '@typp/validator/error'
import type {} from '@typp/validator/extends'

// TODO object
// TODO dictionary
// TODO record
// TODO class/instanceof

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export interface ErrorArgsMap {
      /**
       * e.g.
       * - const t0: [number] = [1, 2]
       * - const t1: [number] = []
       */
      'ValidateError:tuple length not match': [expected: number, actual: number]
      /**
       * e.g.
       * - const t0: [number] = ['1']
       * - const t1: number[] = ['1']
       */
      'ValidateError:item of array not match': [index: number, error: t.ValidateError]
      /**
       * e.g.
       * - const t0: { a: number } = {}
       * - const t1: { a: number, b: number } = {}
       * - const t2: { a: number, b: undefined } = { a: 1 }
       */
      'ValidateError:is missing properties': [
        count: number,
        properties: (readonly [
          key: string | symbol, property: t.Schema<unknown, unknown>
        ])[]
      ]
      /**
       * e.g.
       * - const t0: { a: number } = { a: '1' }
       * - const t1: { a: number, b: number } = { a: '1', b: '2' }
       */
      'ValidateError:not match the properties': [
        count: number,
        properties: (readonly [
          key: string | symbol, error: t.ValidateError
        ])[]
      ]
    }
    export interface ValidateExtendsEntries<T> {
      array: [IsArray<T>, T]
      interface: [IsInterface<T>, T]
      record: [
        t.IsSpecialShape<T, 'record'>,
        t.InferSpecialShapeSchemas<T, 'record'> extends [infer K extends PropertyKey, infer V]
          ? { [k in K]: V }
          : never
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      array: [
        IsArray<T>,
        Switch<{
          null: [
            IsEqual<Input, null>, []
          ]
          // TODO Set, WeakSet
          ArrayLike: [
            [Input] extends [ArrayLike<unknown>] ? true : false,
            [Input] extends [{ length: number }]
              ? T
              : [Input] extends [ArrayLike<infer I>]
                ? I[]
                : never
          ]
        } & {
          [K in SwitchOtherEntry]: Input
        }>
      ]
      interface: [
        IsInterface<T>,
        Switch<{
          null: [
            IsEqual<Input, null>, {}
          ]
        } & {
          [K in SwitchOtherEntry]: Input
        }>
      ]
    }
  }
}

export function structuralValidator(t: typeof tn) {
  t.use(arrayValidator)
  t.use(objectValidator)
}

export function arrayValidator(t: typeof tn): void {
  const { ValidateError } = t

  t.useValidator((s): s is tn.Schema<any[], any[]> => {
    return Array.isArray(s.shape)
    // TODO Array.isArray(Array.prototype) === true
    //      I think `Array.prototype` is an object but not an array, but the logic is not good.
    //      Maybe I should get more information to determine if it's an array.
    // && s.shape !== Array.prototype
  }, {
    validate(input) {
      if (!Array.isArray(input)) {
        return false
      }
      const isTuple = Object.hasOwnProperty.call(this, 'length')
      const length = isTuple ? this.length : input.length
      if (isTuple && input.length !== this.length) {
        throw new ValidateError(
          'partially match',
          this,
          input,
          'ValidateError:tuple length not match',
          [this.shape.length, input.length]
        )
      }
      for (let i = 0; i < length; i++) {
        const shapeItem: tn.Schema<unknown, unknown> = isTuple
          ? this.shape[i]
          : this.shape[0]
        const inputItem = input[i] as unknown
        const result = shapeItem.tryValidate(inputItem)
        if (!result.success) {
          throw new ValidateError(
            'partially match',
            this,
            input,
            'ValidateError:item of array not match',
            [i, result.error]
          )
        }
      }
      return true
    },
    transform(input, options) {
      if (FALSY.includes(input)) return []
      if (typeof input === 'object' && !Array.isArray(input)) {
        if (input === null) return []

        const isTuple = Object.hasOwnProperty.call(this, 'length')

        if (input instanceof Set) {
          // TODO implement `Set` transform to Array or Tuple
        }
        const lengthOrUndefined = 'length' in input ? input.length : undefined
        if (lengthOrUndefined === undefined) {
          return input
        }
        const length = Number.parseInt(String(lengthOrUndefined), 10)
        if (Number.isNaN(length)) {
          return input
        }
        const result = Array.from({ length })
        for (let i = 0; i < length; i++) {
          const item = input[i as keyof typeof input] ?? undefined
          const shapeItem: tn.Schema<unknown, unknown> = isTuple
            ? this.shape[i]
            : this.shape[0]
          result[i] = shapeItem.parse(item, options)
        }
        return result
      }
      return input
    }
  })
}

export function objectValidator(t: typeof tn): void {
  const {
    ValidateError,
    isSpecialShape,
    isWhatSpecialShapeSkm
  } = t

  // interface
  t.useValidator((s): s is tn.Schema<
    Record<string | number | symbol, tn.Schema<unknown, unknown>>,
    Record<string | number | symbol, unknown>
  > => {
    return typeof s.shape === 'object' && !Array.isArray(s.shape) && !isSpecialShape(s.shape)
  }, {
    validate(input) {
      if (typeof input !== 'object' || Array.isArray(input) || input === null) {
        return false
      }
      const actualKeys: (string | symbol)[] = [
        ...Object.keys(input),
        ...Object.getOwnPropertySymbols(input)
      ]
      const expectedKeys: (string | symbol)[] = [
        ...Object.keys(this.shape),
        ...Object.getOwnPropertySymbols(this.shape)
      ]
      const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key))
      if (missingKeys.length > 0) {
        throw new ValidateError(
          'partially match',
          this,
          input,
          'ValidateError:is missing properties',
          [
            missingKeys.length,
            missingKeys.map(key => [key, this.shape[key]] as const)
          ]
        )
      }
      const unexpectedPropertyErrors: [string | symbol, tn.ValidateError][] = []
      for (const _key of expectedKeys) {
        const shapeItem = this.shape[_key]
        const key = _key as keyof typeof input
        const inputItem = input[key]
        const result = shapeItem.tryValidate(inputItem)
        if (!result.success) {
          unexpectedPropertyErrors.push([key, result.error])
        }
      }
      if (unexpectedPropertyErrors.length > 0) {
        throw new ValidateError(
          'partially match',
          this,
          input,
          'ValidateError:not match the properties',
          [
            unexpectedPropertyErrors.length,
            unexpectedPropertyErrors
          ]
        )
      }
      return true
    },
    transform(input, options) {
      return input
    }
  })
  // record
  t.useValidator((s): s is tn.Schema<
    tn.SpecialShape<tn.SpecialShapeTypeMapping['record'], [
      [
        tn.Schema<StringConstructor, string>,
        tn.Schema<NumberConstructor, number>,
        tn.Schema<SymbolConstructor, symbol>
      ],
      tn.Schema<unknown, unknown>
    ]>,
    { [k: PropertyKey]: any }
  > => {
    return isWhatSpecialShapeSkm('record', s)
  }, {
    validate(input, options) {
      if (typeof input !== 'object' || Array.isArray(input) || input === null) {
        return false
      }
      const [keysSkms, valueSkm] = this.shape.schemas
      const keys = [
        ...Object.keys(input),
        ...Object.getOwnPropertySymbols(input)
      ]
      const unexpectedPropertyErrors: [string | symbol, tn.ValidateError][] = []
      // eslint-disable-next-line no-labels
      keyloop: for (const key of keys) {
        for (const skm of keysSkms) {
          const skmResult = (skm as tn.Schema<unknown, unknown>).tryValidate(key, options)
          if (!skmResult.success) {
            unexpectedPropertyErrors.push([key, skmResult.error])
            // eslint-disable-next-line no-labels
            continue keyloop
          }
        }
        const valueSkmResult = valueSkm.tryValidate((input as Record<string | symbol, any>)[key], options)
        if (!valueSkmResult.success) {
          unexpectedPropertyErrors.push([key, valueSkmResult.error])
        }
      }
      if (unexpectedPropertyErrors.length > 0) {
        throw new ValidateError(
          'partially match',
          this,
          input,
          'ValidateError:not match the properties',
          [
            unexpectedPropertyErrors.length,
            unexpectedPropertyErrors
          ]
        )
      }
      return true
    },
    transform(input, options) {
      // TODO resolve Map
      return input
    }
  })
}
