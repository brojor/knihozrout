export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string
}

export interface AuthResponse {
  user: User
  token: Token
}

export interface User {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
}

export interface Token {
  type: string
  name: string | null
  token: string
  abilities: string[]
  lastUsedAt: string | null
  expiresAt: string | null
}
