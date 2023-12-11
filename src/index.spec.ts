import { expectTypeOf } from 'vitest'

import { t } from './index'

expectTypeOf(t(String)).toEqualTypeOf<t.Schema<StringConstructor, string>>()
expectTypeOf(t()).toEqualTypeOf<t.Schema<any, any>>()

const NumberArrSkm = t(Array, Number)
const NumberVectorSkm = t(Array, Array, Number)

expectTypeOf(t(Array)).toEqualTypeOf<t.Schema<
  t.Schema<any, any>[], any[]
>>()
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

expectTypeOf(t([])).toEqualTypeOf<t.Schema<[], []>>()
expectTypeOf(t([], Number)).toEqualTypeOf<t.Schema<
  t.Schema<NumberConstructor, number>[],
  number[]
>>()

const NumberMapToStringSkm = t(Object, Number, String)
expectTypeOf(NumberMapToStringSkm)
  .toEqualTypeOf<
    t.Schema<{
      [x: number]: t.Schema<StringConstructor, string>;
    }, {
      [x: number]: string;
    }>
  >()
