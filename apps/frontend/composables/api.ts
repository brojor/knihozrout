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

export interface Book {
  title: string
  originalTitle: string
  subtitle: string
  description: string
  publicationYear: number
  coverImage: string
  pageCount: number
  language: string
  originalLanguage: string
  ean: number
  publisher: string
  userId: number
  createdAt: string
  updatedAt: string
  id: number
  authors: Author[]
}

export interface Author {
  id: number
  firstName: string
  lastName: string
  photoUrl: any
  birthDate: any
  deathDate: any
  biography: any
  createdAt: string
  updatedAt: string
  fullName: string
  sortableName: string
}

export function useApi() {
  const { $customFetch } = useNuxtApp()

  /*
  * Auth
  */
  async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return $customFetch('/auth/register', {
      method: 'POST',
      body: credentials,
    })
  }

  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    return $customFetch('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async function logout(): Promise<void> {
    return $customFetch('/auth/logout', {
      method: 'POST',
    })
  }

  /*
  * Books
  */
  async function fetchBookByEAN(ean: number): Promise<Book> {
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
