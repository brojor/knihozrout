import { HttpContext } from '@adonisjs/core/http'
import { BookService } from '#services/book_service'
import { storeFromEanValidator, storeFromUrlValidator } from '#validators/book'
export default class BooksController {
  async storeFromEan({ request, auth, response }: HttpContext) {
    const { ean, libraryId } = await request.validateUsing(storeFromEanValidator)
    const bookService = new BookService(auth)

    try {
      const book = await bookService.createFromEan(ean, libraryId)
      return response.created(book)
    } catch (error) {
      return response.notFound({ error: `${error.name}: ${error.message}` })
    }
  }

  async storeFromUrl({ request, auth, response }: HttpContext) {
    const { url, libraryId } = await request.validateUsing(storeFromUrlValidator)
    const bookService = new BookService(auth)

    try {
      const book = await bookService.createFromUrl(url, libraryId)
      return response.created(book)
    } catch (error) {
      return response.notFound({ error: `${error.name}: ${error.message}` })
    }
  }
}
