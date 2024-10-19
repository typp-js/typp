import type { t as tn, Typp } from '@typp/core/base'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    // TODO https://zod.dev/?id=coercion-for-primitives
    // export const coerce: typeof tn
    export interface ValidateOptions {
      /**
       * Try to validate, wrap the result with `ValidateResult`
       */
      try?: boolean
      /**
       * Narrow input type and return the input value literally
       */
      const?: boolean
      /**
       * Input must exactly match the type
       */
      exact?: boolean
      /**
       * no transform and exact match
       */
      strict?: boolean
      /**
       * As much as possible transform input value to the type
       */
      transform?: boolean
    }
  }
}

export type Transform<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => unknown
export type Validate<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => boolean
