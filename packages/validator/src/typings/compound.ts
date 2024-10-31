import type { t as tn } from '@typp/core/base'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export interface ErrorArgsMap {
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
      return this.shape.schemas.every(schema => schema.tryValidate(input).success)
    },
    transform: i => i
  })
}
