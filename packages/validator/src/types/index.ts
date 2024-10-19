import type { t as tn } from '@typp/core/base'
import { literalValidator } from '@typp/validator/types/literal'
import { bigintValidator } from '@typp/validator/types/primitive.bigint'
import { booleanValidator } from '@typp/validator/types/primitive.boolean'
import { numberValidator } from '@typp/validator/types/primitive.number'
import { stringValidator } from '@typp/validator/types/primitive.string'
import { symbolValidator } from '@typp/validator/types/primitive.symbol'

export function typesValidator(t: typeof tn) {
  t.use(bigintValidator)
  t.use(booleanValidator)
  t.use(numberValidator)
  t.use(stringValidator)
  t.use(symbolValidator)

  t.use(literalValidator)
}
