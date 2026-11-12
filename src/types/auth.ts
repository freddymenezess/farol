export type LoginState = {
  success: boolean
  error?: string
  email?: string
}

export type RegisterState = {
  values?: {
    email?: string
    firstPassword?: string
    secondPassword?: string
  }
  error?: Record<string, string[] | undefined>
  success: boolean
}
