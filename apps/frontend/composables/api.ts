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

export interface Book {
  id: number
  title: string
  subtitle: string | null
  originalTitle: string | null
  description: string | null
  publicationYear: number | null
  coverImage: string | null
  pageCount: number | null
  language: string | null
  originalLanguage: string | null
  ean: number | null
  publisher: string | null
  userId: number
  libraryId: number
  seriesId: number | null
  seriesOrder: number | null
  createdAt: string
  updatedAt: string | null
  authors: Author[]
  genres?: Genre[]
  series?: Series
  library?: Library
  readingState?: ReadingState
}

export interface Author {
  id: number
  firstName: string
  lastName: string
  photoUrl: string | null
  birthDate: string | null
  deathDate: string | null
  biography: string | null
  fullName: string
  sortableName: string
  createdAt: string
  updatedAt: string | null
}

export interface Genre {
  id: number
  name: string
  createdAt: string
  updatedAt: string | null
}

export interface Series {
  id: number
  name: string
  description: string | null
  plannedBooksCount: number | null
  createdAt: string
  updatedAt: string | null
}

export interface Library {
  id: number
  name: string
  description: string | null
  userId: number
  createdAt: string
  updatedAt: string | null
}

export interface ReadingState {
  id: number
  bookId: number
  status: 'unread' | 'reading' | 'read' | 'paused' | 'want_to_read' | 'wishlist'
  createdAt: string
  updatedAt: string | null
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

  async function fetchBookFromUrl(url: string): Promise<Book> {
    return $customFetch('/api/books/from-url', {
      method: 'POST',
      body: { url },
    })
  }

  async function fetchBook(id: number): Promise<Book> {
    return $customFetch(`/api/books/${id}`, {
      method: 'GET',
    })
  }

  return {
    register,
    login,
    logout,
    fetchBookByEAN,
    fetchBookFromUrl,
    fetchBook,
  }
}
