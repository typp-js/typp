import { expectTypeOf } from 'vitest'

import { t } from './index'

expectTypeOf(t(String)).toEqualTypeOf<t.Schema<StringConstructor, string>>()
expectTypeOf(t()).toEqualTypeOf<t.Schema<any, any>>()

const NumberArrSkm = t(Array, Number)
const NumberVectorSkm = t(Array, Array, Number)
const NumberMapToStringSkm = t(Object, Number, String)

expectTypeOf(NumberArrSkm)
  .toEqualTypeOf<
    t.Schema<
      t.Schema<NumberConstructor, number>[],
      number[]
    >
  >()

expectTypeOf(NumberVectorSkm)
  .toEqualTypeOf<
    t.Schema<
      t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
      number[][]
    >
  >()

expectTypeOf(NumberMapToStringSkm)
  .toEqualTypeOf<
    t.Schema<{
      [x: number]: t.Schema<StringConstructor, string>;
    }, {
      [x: number]: string;
    }>
  >()
