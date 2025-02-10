export type LanguageCode = 'cs' | 'sk' | 'en' | 'de' | 'pl' | 'es' | 'fr' | 'it'

export interface ScrapedAuthor {
  firstName: string
  lastName: string
}

export interface ScrapedBook {
  title: string
  originalTitle?: string
  subtitle?: string
  description?: string
  authors: ScrapedAuthor[]
  publicationYear?: number
  coverImage?: string
  pageCount?: number
  language?: LanguageCode
  originalLanguage?: LanguageCode
  publisher?: string
}

export type PartialScrapedBook = Partial<ScrapedBook>