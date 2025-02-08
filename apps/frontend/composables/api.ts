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
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Token {
  type: string
  name: any
  token: string
  abilities: string[]
  lastUsedAt: any
  expiresAt: any
}

export function useApi() {
  const { $customFetch } = useNuxtApp()

  /*
  * Auth
  */
  async function register(credentials: RegisterCredentials) {
    return $customFetch('/auth/register', {
      method: 'POST',
      body: credentials,
    })
  }

  async function login(credentials: LoginCredentials) {
    return $customFetch('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async function logout() {
    return $customFetch('/auth/logout', {
      method: 'POST',
    })
  }

  /*
  * Books
  */
  async function fetchBookByEAN(ean: string) {
    return $customFetch('/api/books/from-ean', {
      method: 'POST',
      body: { ean },
    })
  }

  return {
    register,
    login,
    logout,
    fetchBookByEAN,
  }
}
