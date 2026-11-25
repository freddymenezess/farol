export type ActionResult<TData = never, TError = string, TValues = never> =
  | {
      success: true
      data: TData
    }
  | {
      success: false
      error: TError
      values?: TValues
      retryAfter?: number
    }
