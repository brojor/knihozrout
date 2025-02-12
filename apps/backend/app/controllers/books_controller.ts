import { HttpContext } from '@adonisjs/core/http'
import BookScraper, { DetailsProviderError, EanProviderError } from '@knihozrout/scraper'
import env from '#start/env'
import Book from '#models/book'
import Author from '#models/author'
import Library from '#models/library'
import { scrapedBookValidator, eanValidator } from '#validators/book'
import { errors } from '@vinejs/vine'
import FailedEanLookup from '#models/failed_ean_lookup'
import FailedUrlLookup from '#models/failed_url_lookup'
import BookStatus from '#models/book_status'
import { OwnershipStatus } from '#models/book_status'

export default class BooksController {
  private async getTargetLibrary(auth: HttpContext['auth'], libraryId?: number) {
    if (libraryId) {
      return await Library.query()
        .where('id', libraryId)
        .where('user_id', auth.user!.id)
        .firstOrFail()
    }

    // Pokud není libraryId specifikováno, použijeme první (a jedinou) knihovnu uživatele
    return await Library.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', 'asc')
      .firstOrFail()
  }

  /**
   * Vytvoří novou knihu pomocí EAN kódu
   */
  async storeFromEan({ request, auth, response }: HttpContext) {
    const { ean } = await request.validateUsing(eanValidator)
    const libraryId = request.input('libraryId')

    const savedBook = await Book.findBy('ean', ean)
    if (savedBook) {
      const targetLibrary = await this.getTargetLibrary(auth, libraryId)

      // Vytvoříme BookStatus a přidáme do knihovny
      await BookStatus.create({
        bookId: savedBook.id,
        userId: auth.user!.id,
        status: OwnershipStatus.OWNED,
      })
      await savedBook.related('libraries').attach([targetLibrary.id])

      await savedBook.load('authors')
      return response.ok(savedBook)
    }

    const scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))

    try {
      const scrapedBook = await scraper.scrapeBookDetails(ean)
      const targetLibrary = await this.getTargetLibrary(auth, libraryId)

      // Vytvoření nebo nalezení autorů
      const authorIds = []
      for (const authorData of scrapedBook.authors || []) {
        const author = await Author.updateOrCreate(
          { firstName: authorData.firstName, lastName: authorData.lastName },
          authorData
        )
        authorIds.push(author.id)
      }

      // Validace dat
      const validatedData = await scrapedBookValidator.validate({ ...scrapedBook, ean })

      // Vytvoření knihy včetně vztahů
      const book = await Book.create(validatedData)
      await book.related('authors').attach(authorIds)

      // Vytvoření BookStatus a přidání do knihovny
      await BookStatus.create({
        bookId: book.id,
        userId: auth.user!.id,
        status: OwnershipStatus.OWNED,
      })
      await book.related('libraries').attach([targetLibrary.id])

      await book.load('authors')
      return response.created(book)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.error(error.messages)
        return response.badRequest({ error: error.messages })
      } else if (error instanceof DetailsProviderError) {
        await FailedEanLookup.create({
          ean,
          userId: auth.user!.id,
          error: error.message,
        })
        return response.notFound({ error: `${error.name}: ${error.message}` })
      }

      return response.badRequest({ error: `${error.name}: ${error.message}` })
    }
  }

  /**
   * Vytvoří novou knihu pomocí URL adresy
   */
  async storeFromUrl({ request, auth, response }: HttpContext) {
    const url = request.input('url')
    const libraryId = request.input('libraryId')
    let ean: number | undefined

    const scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))

    try {
      // Získáme EAN z URL
      ean = await scraper.getEanFromUrl(url)

      const savedBook = await Book.findBy('ean', ean)

      if (savedBook) {
        const targetLibrary = await this.getTargetLibrary(auth, libraryId)

        // Vytvoříme BookStatus a přidáme do knihovny
        await BookStatus.create({
          bookId: savedBook.id,
          userId: auth.user!.id,
          status: OwnershipStatus.OWNED,
        })
        await savedBook.related('libraries').attach([targetLibrary.id])

        await savedBook.load('authors')
        return response.ok(savedBook)
      }

      const scrapedBook = await scraper.scrapeBookDetails(ean)
      const targetLibrary = await this.getTargetLibrary(auth, libraryId)

      // Vytvoření nebo nalezení autorů
      const authorIds = []
      for (const authorData of scrapedBook.authors || []) {
        const author = await Author.updateOrCreate(
          { firstName: authorData.firstName, lastName: authorData.lastName },
          authorData
        )
        authorIds.push(author.id)
      }

      // Validace dat
      const validatedData = await scrapedBookValidator.validate({ ...scrapedBook, ean })

      // Vytvoření knihy včetně vztahů
      const book = await Book.create(validatedData)
      await book.related('authors').attach(authorIds)

      // Vytvoření BookStatus a přidání do knihovny
      await BookStatus.create({
        bookId: book.id,
        userId: auth.user!.id,
        status: OwnershipStatus.OWNED,
      })
      await book.related('libraries').attach([targetLibrary.id])

      await book.load('authors')

      return response.created(book)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.error(error.messages)
        return response.badRequest({ error: error.messages })
      } else if (error instanceof EanProviderError) {
        await FailedUrlLookup.create({
          url,
          userId: auth.user!.id,
          error: error.message,
        })
        return response.notFound({ error: `${error.name}: ${error.message}` })
      } else if (error instanceof DetailsProviderError) {
        await FailedEanLookup.create({
          ean,
          userId: auth.user!.id,
          error: error.message,
        })
        return response.notFound({ error: `${error.name}: ${error.message}` })
      }

      return response.badRequest({ error: `${error.name}: ${error.message}` })
    }
  }
}
