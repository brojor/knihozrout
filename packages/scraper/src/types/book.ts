export type LanguageCode = 'cs' | 'sk' | 'en' | 'de' | 'pl' | 'es' | 'fr' | 'it'

export interface ScrapedAuthor {
  firstName: string
  lastName: string
}

export interface ScrapedBook {
  title: string
  subtitle?: string
  authors: ScrapedAuthor[]
  publicationYear?: number
  coverImage?: string
  pageCount?: number
  language?: LanguageCode
  isbn?: string
  publisher?: string
}

export type PartialScrapedBook = Partial<ScrapedBook>

export interface SearchResult {
  url: string
  domain: string
} 