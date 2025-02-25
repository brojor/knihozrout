import Book from '#models/book'
import BookStatus from '#models/book_status'
import { OwnershipStatus } from '#models/book_status'
import { HttpContext } from '@adonisjs/core/http'
import BookScraper, { ScrapedBook } from '@knihozrout/scraper'
import { createBookValidator } from '#validators/book'
import FailedEanLookup from '#models/failed_ean_lookup'
import FailedUrlLookup from '#models/failed_url_lookup'
import { LibraryService } from '#services/library_service'
import { AuthorService } from '#services/author_service'
import env from '#start/env'
import { DetailsProviderError, EanProviderError } from '@knihozrout/scraper'
import ReadingState, { ReadingStatus } from '#models/reading_state'
import BookNotFoundException from '#exceptions/book_not_found_exception'
import BookAlreadyExistsException from '#exceptions/book_already_exists_exception'

export class BookService {
  private libraryService: LibraryService
  private authorService: AuthorService
  private scraper: BookScraper

  constructor(private auth: HttpContext['auth']) {
    this.libraryService = new LibraryService(auth)
    this.authorService = new AuthorService()
    this.scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))
  }

  private async setBookStatus(bookId: number, status: OwnershipStatus): Promise<BookStatus> {
    return await BookStatus.updateOrCreate({ bookId, userId: this.auth.user!.id }, { status })
  }

  private async setInitialReadingState(bookId: number): Promise<void> {
    await ReadingState.updateOrCreate(
      { bookId, userId: this.auth.user!.id },
      { status: ReadingStatus.UNREAD }
    )
  }

  private async handleExistingBook(book: Book, libraryId?: number): Promise<Book> {
    const targetLibrary = await this.libraryService.getTargetLibrary(libraryId)

    await book.load('libraries')
    const existingLibrary = book.libraries.find((library) => library.userId === this.auth.user!.id)

    if (existingLibrary) {
      throw new BookAlreadyExistsException('Kniha již existuje v knihovně', {
        bookId: book.id,
        libraryId: existingLibrary.id,
      })
    }

    await book.related('libraries').attach([targetLibrary.id])
    await this.setInitialReadingState(book.id)
    await this.setBookStatus(book.id, OwnershipStatus.OWNED)

    return await this.loadBookRelations(book)
  }

  private async createNewBook(scrapedBook: ScrapedBook, libraryId?: number): Promise<Book> {
    const targetLibrary = await this.libraryService.getTargetLibrary(libraryId)
    const authorIds = await this.authorService.createAuthors(scrapedBook.authors)

    const validatedData = await createBookValidator.validate(scrapedBook)
    const book = await Book.create(validatedData)

    await book.related('authors').attach(authorIds)
    await this.setBookStatus(book.id, OwnershipStatus.OWNED)
    await book.related('libraries').attach([targetLibrary.id])
    await this.setInitialReadingState(book.id)

    return await this.loadBookRelations(book)
  }

  private async createBookFromEan(ean: number, libraryId?: number): Promise<Book> {
    const savedBook = await Book.findBy('ean', ean)
    if (savedBook) {
      return await this.handleExistingBook(savedBook, libraryId)
    }

    const scrapedBook = await this.scraper.scrapeBookDetails(ean)
    return await this.createNewBook(scrapedBook, libraryId)
  }

  private async handleError(error: any, ean?: number, url?: string): Promise<never> {
    if (error instanceof BookAlreadyExistsException) {
      throw error
    }

    if (error instanceof EanProviderError && url) {
      await this.logFailedUrlLookup(url, error.message)
    } else if (error instanceof DetailsProviderError && ean) {
      await this.logFailedEanLookup(ean, error.message)
    }
    throw new BookNotFoundException('Kniha nenalezena')
  }

  async createFromEan(ean: number, libraryId?: number): Promise<Book> {
    try {
      return await this.createBookFromEan(ean, libraryId)
    } catch (error) {
      return await this.handleError(error, ean)
    }
  }

  async createFromUrl(url: string, libraryId?: number): Promise<Book> {
    try {
      const ean = await this.scraper.getEanFromUrl(url)
      return await this.createBookFromEan(ean, libraryId)
    } catch (error) {
      return await this.handleError(error, undefined, url)
    }
  }

  async getById(id: number): Promise<Book> {
    const book = await Book.findOrFail(id)

    return await this.loadBookRelations(book)
  }

  private async logFailedEanLookup(ean: number, error: string): Promise<void> {
    await FailedEanLookup.create({
      ean,
      userId: this.auth.user!.id,
      error,
    })
  }

  private async logFailedUrlLookup(url: string, error: string): Promise<void> {
    await FailedUrlLookup.create({
      url,
      userId: this.auth.user!.id,
      error,
    })
  }

  private async loadBookRelations(book: Book): Promise<Book> {
    await book.load('authors')
    await book.load('libraries')
    await book.load('bookStatuses')
    await book.load('readingStates')
    return book
  }

  async getUserBooks(): Promise<Book[]> {
    const user = this.auth.user!

    const books = await Book.query()
      .whereHas('libraries', (query) => {
        query.where('user_id', user.id)
      })
      .preload('authors')
      .preload('libraries')
      .preload('bookStatuses')
      .preload('readingStates')

    return books
  }
}
