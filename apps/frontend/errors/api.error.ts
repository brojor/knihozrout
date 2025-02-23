import type { ApiErrorResponse } from '~/types/api'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly errors?: ValidationError[]
  readonly data?: Record<string, unknown>

  constructor(response: ApiErrorResponse) {
    super(`API Error: ${response.status} ${response.code}`)
    this.name = 'ApiError'
    this.status = response.status
    this.code = response.code
    this.errors = response.errors
    this.data = response.data
  }
}
