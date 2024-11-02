import type { t as tn } from '@typp/core/base'
import type { IsNotEqual, IsUnion } from '@typp/core/types'
import { ValidateError } from '@typp/validator/error'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export interface ErrorArgsMap {
      /**
       * e.g.
       * - const t0: { a: string } & { b: number } = { a: 1 }
       * - const t1: { a: string } & { b: number } = { a: '1' }
       */
      'ValidateError:intersection not match': [(readonly [skm: t.Schema<unknown, unknown>, error: ValidateError])[]]
    }
    interface ValidateExtendsEntries<T> {
      union: [IsUnion<T> & IsNotEqual<T, boolean>, T]
    }
    interface ValidateTransformEntries<T, Input, InputRest> {
      union: [IsUnion<T> & IsNotEqual<T, boolean>, T]
    }
  }
}

export function compoundValidator(t: typeof tn) {
  const {
    isWhatSpecialShapeSkm
  } = t
  t.useValidator((s): s is tn.Schema<
    tn.SpecialShape<
      tn.SpecialShapeTypeMapping['union'],
      tn.Schema<unknown, unknown>[]
    >,
    any
  > => isWhatSpecialShapeSkm('union', s), {
    validate(input, options) {
      return this.shape.schemas.some(schema => schema.tryValidate(input).success)
    },
    // TODO map schema transform
    transform: i => i
  })
  t.useValidator((s): s is tn.Schema<
    tn.SpecialShape<
      tn.SpecialShapeTypeMapping['intersection'],
      tn.Schema<unknown, unknown>[]
    >,
    any
  > => isWhatSpecialShapeSkm('intersection', s), {
    validate(input, options) {
      const errors = this.shape.schemas
        .map(schema => [schema, schema.tryValidate(input)] as const)
        .filter(([, result]) => !result.success)
        .map(([schema, result]) => [schema, result.error] as const)
      if (errors.length === 0) return true
      throw new ValidateError(
        'unexpected',
        this,
        input,
        'ValidateError:intersection not match',
        [errors]
      )
    },
    // TODO map schema transform
    transform: i => i
  })
}
