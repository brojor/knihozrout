import type { LanguageCode } from '~/constants/languageNames'

export interface Book {
  id: number
  title: string
  subtitle: string | null
  publicationYear: number | null
  coverImage: string | null
  pageCount: number | null
  language: LanguageCode | null
  ean: number | null
  publisher: string | null
  originalTitle: string | null
  originalLanguage: string | null
  description: string | null
  createdAt: string
  updatedAt: string | null

  authors: Author[]
  genres?: Genre[]
  series?: Series[]
  readingStates?: ReadingState[]
  readingSessions?: ReadingSession[]
  loans?: BookLoan[]
  bookStatuses?: BookStatus[]
  libraries?: Library[]
}
