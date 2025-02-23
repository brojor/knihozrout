export interface ValidationError {
  message: string
  rule: string
  field: string
  meta?: Record<string, unknown>
}

export interface ApiErrorResponse {
  status: number
  code: string
  errors?: ValidationError[]
  data?: Record<string, unknown>
}

export type ApiResponse<T> = T | ApiError
