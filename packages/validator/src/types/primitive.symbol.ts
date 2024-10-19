import type { LiteralTypeGuard } from '#internal'

import type { IsWhat, OnlySubType, t as tn } from '@typp/core/base'
import { preprocess } from '@typp/validator/utils'

// dprint-ignore
declare module '@typp/core/base' {
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
        LiteralTypeGuard<symbol, T, Input extends symbol ? symbol : unknown>
      ]
    }
  }
}

export const symbolTransform: tn.Validator<symbol>['transform'] = function(input, options) {
  return Symbol(String(input))
}

export function symbolValidator(t: typeof tn) {
  t.useValidator([Symbol], {
    preprocess,
    validate: input => typeof input === 'symbol',
    transform: symbolTransform
  })
}
