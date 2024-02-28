import type { IsWhat, OnlySubType, t as tn } from '@typp/core'

import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      symbol: [
        IsWhat<T, symbol>, symbol | Symbol,
      ]
      'literal:symbol': [
        OnlySubType<T, symbol>, T & symbol
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      symbol: [
        [T] extends [symbol] ? true : false,
        Input extends symbol ? symbol : unknown
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
