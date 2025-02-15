// types/common.ts
export interface ApiResponse<T> {
  data: T | null
  error?: string
}

export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>
  body?: any
  query?: Record<string, string>
}

export interface ApiError {
  status: number
  message: string
}

export interface AdonisError {
  message: string
  status: number
  code: string
  errors?: {
    rule: string
    field: string
    message: string
  }[]
}
