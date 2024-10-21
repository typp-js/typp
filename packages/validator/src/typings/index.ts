import type { t as tn } from '@typp/core/base'
import { literalValidator } from '@typp/validator/typings/literal'
import { bigintValidator } from '@typp/validator/typings/primitive.bigint'
import { booleanValidator } from '@typp/validator/typings/primitive.boolean'
import { numberValidator } from '@typp/validator/typings/primitive.number'
import { stringValidator } from '@typp/validator/typings/primitive.string'
import { symbolValidator } from '@typp/validator/typings/primitive.symbol'

export function typesValidator(t: typeof tn) {
  t.use(bigintValidator)
  t.use(booleanValidator)
  t.use(numberValidator)
  t.use(stringValidator)
  t.use(symbolValidator)

  t.use(literalValidator)
}
