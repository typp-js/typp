import { catchAndWrapProxy } from '#internal/utils.ts'

import type { AtLeastOneProperty, t as tn } from '@typp/core/base'
import { ParseError, ValidateError } from '@typp/validator/error'
import type {} from '@typp/validator/extends'

const validatorMappingByMatcher = [] as [
  matcher: tn.Match,
  validator: AtLeastOneProperty<tn.Validator>
][]
const validators = new Map<unknown, AtLeastOneProperty<tn.Validator>>()

// 如果俩个类型之间不支持转化，应该抛出「校验错误」还是「转化错误」？
// 实际上来说，一个值不能作为某个类型使用，存在俩种情况
// - 这个值不能被转化为目标的类型
//   - `{ a: 1 }` 就是转化不到 `number` 的
//     `{ a: 1, b: 2 }` 是可以转化到 `{ a: number }` 的，只需要删除掉多余的部分就可以了
// - 这个值就是不匹配目标类型，哪怕转化了也是
//   - `1` 就是不匹配 `'2' | '3'` 的
//   - `{}` 并不在 `number` 的转化范围内，是一个无法被转化的值，这个时候应该抛出「校验错误」的异常，而不是「无法转化」的异常
function validate(this: tn.Schema<any, any>, data: any, options?: tn.ValidateOptions): any
function validate(this: tn.Schema<any, any>, ...args: any[]): any {
  if (args.length === 0) {
    throw new Error('No data to validate')
  }
  const [data, options = {}] = args as [any, tn.ValidateOptions]
  const {
    try: isTry = false,
    const: isConst = false,
    exact: isExact = false,
    transform: isTransform = false
  } = options
  const wrap = () => {
    // TODO
    //  完全匹配
    //  部分匹配，部分缺失或不匹配: partially
    //  完全不匹配: unexpected
    //  完全匹配但超过了原类型: excessive
    let rt = data
    let validator: AtLeastOneProperty<tn.Validator> | undefined
    if (validators.has(this.shape)) {
      validator = validators.get(this.shape)
    } else {
      for (const [matcher, v] of validatorMappingByMatcher) {
        if (matcher(this, rt)) {
          validator = v
          break
        }
      }
    }
    if (!validator) {
      throw new Error(
        `Unable to validate when shape is \`${this.shape}\`, because the shape is not supported validator`
      )
    }

    const {
      preprocess: preprocessNoThis,
      validate: validateNoThis,
      transform: transformNoThis
    } = validator
    const [
      validate,
      transform,
      preprocess
      // @ts-ignore error TS2589: Type instantiation is excessively deep and possibly infinite.
    ] = [validateNoThis, transformNoThis, preprocessNoThis].map(fn => fn?.bind(this))
    if (!validate) {
      throw new Error(`Unable to validate when shape is ${this.shape}, because the shape is not supported validator`)
    }

    try {
      rt = preprocess ? preprocess(rt, options) : rt
    } catch (e) {
      if (e instanceof Error) {
        throw new ParseError('preprocess', this, rt, e)
      }
      throw e
    }

    if (isTransform && !validate(rt, options)) {
      if (!transform) {
        throw new Error(
          `Unable to transform when shape is ${this.shape}, because the shape is not supported transformer`
        )
      }

      try {
        rt = transform(rt, options)
      } catch (e) {
        if (e instanceof Error) {
          throw new ParseError('transform', this, rt, e)
        }
        throw e
      }
    }
    if (!validate(rt, options)) {
      throw new ValidateError('unexpected', this, rt)
    }
    return rt
  }
  return isTry ? catchAndWrapProxy(wrap)() : wrap()
}
validate.narrow = validate
function validateGen(skm: tn.Schema<any, any>, defaultOptions?: tn.ValidateOptions) {
  function inner(...args: any[]) {
    if (args.length === 0) {
      throw new Error('No data to validate')
    }
    const [data, options] = args
    return validate.call(skm, data, {
      ...defaultOptions,
      ...options
    })
  }
  inner.narrow = (...args: unknown[]) => inner(...args)
  return inner
}

export function validatorSkeleton(t: typeof tn) {
  t.useStatic('useValidator', (shapesOrMatcher, validator) => {
    if (Array.isArray(shapesOrMatcher)) {
      for (const shape of shapesOrMatcher) {
        validators.set(shape, validator)
      }
      return () => {
        for (const shape of shapesOrMatcher) {
          validators.delete(shape)
        }
      }
    } else {
      const item = [shapesOrMatcher, validator] as (typeof validatorMappingByMatcher)[number]
      validatorMappingByMatcher.push(item)
      return () => {
        const index = validatorMappingByMatcher.indexOf(item)
        if (index !== -1) {
          validatorMappingByMatcher.splice(index, 1)
        }
      }
    }
  })
  t.useStatic('ParseError', ParseError)
  t.useStatic('ValidateError', ValidateError)
  t.useFields({
    get validate() {
      return validateGen(this)
    },
    get tryValidate() {
      return validateGen(this, { try: true })
    },
    get parse() {
      return validateGen(this, { transform: true })
    },
    get tryParse() {
      return validateGen(this, { try: true, transform: true })
    }
  })
  t.useFields({
    test(data: unknown, options = {}): data is any {
      return validateGen(this, { ...options, try: true })(data, options).success
    }
  })
}
