import type { t as tn } from '@typp/core'

import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      symbol: [
        [T] extends [symbol] ? true : false,
        symbol
      ]
    }
    export interface ValidateTransformEntries<T, InputRest> {
      symbol: [
        [T] extends [symbol] ? true : false,
        InputRest extends symbol ? symbol : unknown
      ]
    }
  }
}

export function symbolValidator(t: typeof tn) {
  t.useValidator([Symbol], {
    preprocess,
    validate: input => typeof input === 'symbol',
    transform: input => Symbol(String(input))
  })
}
