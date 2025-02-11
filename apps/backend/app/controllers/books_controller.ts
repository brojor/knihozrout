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

export default class BooksController {
  /**
   * Vytvoří novou knihu pomocí EAN kódu
   */
  async storeFromEan({ request, auth, response }: HttpContext) {
    const { ean } = await request.validateUsing(eanValidator)
    const libraryId = request.input('libraryId')

    // Najdeme knihovnu - buď specifikovanou nebo výchozí
    const targetLibraryId =
      libraryId ||
      (await Library.query()
        .where('userId', auth.user!.id)
        .orderBy('createdAt', 'asc')
        .firstOrFail()
        .then((library) => library.id))

    const scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))

    try {
      const scrapedBook = await scraper.scrapeBookDetails(ean)

      // Vytvoření nebo nalezení autorů
      const authorIds = []
      for (const authorData of scrapedBook.authors || []) {
        const author = await Author.updateOrCreate(
          { firstName: authorData.firstName, lastName: authorData.lastName },
          authorData
        )
        authorIds.push(author.id)
      }

      // Příprava dat pro knihu
      const bookData = {
        ...scrapedBook,
        ean: Number(ean),
        userId: auth.user!.id,
        libraryId: targetLibraryId,
      }

      // Validace dat
      const validatedData = await scrapedBookValidator.validate(bookData)

      // Vytvoření knihy včetně vztahů
      const book = await Book.create(validatedData)
      await book.related('authors').attach(authorIds)
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

    // Najdeme knihovnu - buď specifikovanou nebo výchozí
    const targetLibraryId =
      libraryId ||
      (await Library.query()
        .where('userId', auth.user!.id)
        .orderBy('createdAt', 'asc')
        .firstOrFail()
        .then((library) => library.id))

    const scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))

    try {
      // Získáme EAN z URL
      ean = await scraper.getEanFromUrl(url)

      // Použijeme existující logiku pro získání detailů knihy
      const scrapedBook = await scraper.scrapeBookDetails(ean)

      // Vytvoření nebo nalezení autorů
      const authorIds = []
      for (const authorData of scrapedBook.authors || []) {
        const author = await Author.updateOrCreate(
          { firstName: authorData.firstName, lastName: authorData.lastName },
          authorData
        )
        authorIds.push(author.id)
      }

      // Příprava dat pro knihu
      const bookData = {
        ...scrapedBook,
        ean,
        userId: auth.user!.id,
        libraryId: targetLibraryId,
      }

      // Validace dat
      const validatedData = await scrapedBookValidator.validate(bookData)

      // Vytvoření knihy včetně vztahů
      const book = await Book.create(validatedData)
      await book.related('authors').attach(authorIds)
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
