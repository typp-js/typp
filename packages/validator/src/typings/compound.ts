import { t, t as tn } from '@typp/core/base'
import isWhatSpecialShapeSkm = t.isWhatSpecialShapeSkm

// TODO union
// TODO intersection

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {}
}

export function unionValidator(t: typeof tn) {
  const { ValidateError } = t
  t.useValidator((s): s is tn.Schema<
    tn.SpecialShape<
      tn.SpecialShapeTypeMapping['union'],
      tn.Schema<unknown, unknown>[]
    >,
    any
  > => isWhatSpecialShapeSkm('union', s), {
    validate(input, options) {
      const { schemas } = this.shape
      let result: tn.ValidateErrorResult
      for (const schema of schemas) {
        const r = schema.tryValidate(input)
        if (r.success) {
          return true
        } else {
        }
        result = r.error
      }
      throw new ValidateError(
        'union',
        this,
        input,
        'ValidateError:union not match any schemas',
        [schemas]
      )
    },
    transform: i => i
  })
}
