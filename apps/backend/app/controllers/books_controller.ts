import { HttpContext } from '@adonisjs/core/http'
import { BookService } from '#services/book_service'
import { storeFromEanValidator, storeFromUrlValidator } from '#validators/book'
export default class BooksController {
  async storeFromEan({ request, auth, response }: HttpContext) {
    const { ean, libraryId } = await request.validateUsing(storeFromEanValidator)
    const bookService = new BookService(auth)

    try {
      const result = await bookService.createFromEan(ean, libraryId)

      if (result.existsInOtherLibrary) {
        return response.conflict({
          message: 'Kniha je již v jiné vaší knihovně',
          book: result.book,
        })
      }

      if (!result.wasAddedToLibrary) {
        return response.conflict({
          message: 'Kniha je již v této knihovně',
          book: result.book,
        })
      }

      return response.created(result.book)
    } catch (error) {
      return response.notFound({ error: `${error.name}: ${error.message}` })
    }
  }

  async storeFromUrl({ request, auth, response }: HttpContext) {
    const { url, libraryId } = await request.validateUsing(storeFromUrlValidator)
    const bookService = new BookService(auth)

    try {
      const result = await bookService.createFromUrl(url, libraryId)

      if (result.existsInOtherLibrary) {
        return response.conflict({
          message: 'Kniha je již v jiné vaší knihovně',
          book: result.book,
        })
      }

      if (!result.wasAddedToLibrary) {
        return response.conflict({
          message: 'Kniha je již v této knihovně',
          book: result.book,
        })
      }

      return response.created(result.book)
    } catch (error) {
      return response.notFound({ error: `${error.name}: ${error.message}` })
    }
  }
}
