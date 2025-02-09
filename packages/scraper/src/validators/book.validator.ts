import { PartialScrapedBook, ScrapedBook, ScrapedAuthor } from '../types/book'

export class BookValidator {
  /**
   * Kontroluje, zda částečná data knihy obsahují všechna povinná pole
   */
  static isValid(book: PartialScrapedBook): book is ScrapedBook {
    return this.hasValidTitle(book) && 
           this.hasValidAuthors(book)
  }

  /**
   * Kontroluje, zda jsou vyplněna všechna možná pole knihy
   */
  static isComplete(book: PartialScrapedBook): boolean {
    return this.isValid(book) &&
           this.hasAllOptionalFields(book)
  }

  /**
   * Kontroluje, zda jsou data dostatečná pro sloučení s další knihou
   */
  static isValidForMerge(book: PartialScrapedBook): boolean {
    return Object.values(book).some(value => value !== undefined)
  }

  private static hasValidTitle(book: PartialScrapedBook): boolean {
    return typeof book.title === 'string' && book.title.trim().length > 0
  }

  private static hasValidAuthors(book: PartialScrapedBook): boolean {
    return Array.isArray(book.authors) && 
           book.authors.length > 0 && 
           book.authors.every(this.isValidAuthor)
  }

  private static isValidAuthor(author: Partial<ScrapedAuthor>): boolean {
    return typeof author.firstName === 'string' &&
           author.firstName.trim().length > 0 &&
           typeof author.lastName === 'string' &&
           author.lastName.trim().length > 0
  }

  private static hasAllOptionalFields(book: PartialScrapedBook): boolean {
    const optionalFields: (keyof ScrapedBook)[] = [
      'originalTitle',
      'subtitle',
      'description',
      'publicationYear',
      'coverImage',
      'pageCount',
      'originalLanguage',
      'publisher',
      'language'
    ]

    return optionalFields.every(field => book[field] !== undefined)
  }
} 