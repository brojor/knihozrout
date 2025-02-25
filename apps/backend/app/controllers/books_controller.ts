import { HttpContext } from '@adonisjs/core/http'
import { BookService } from '#services/book_service'
import { storeFromEanValidator, storeFromUrlValidator } from '#validators/book'
export default class BooksController {
  async storeFromEan({ request, auth, response }: HttpContext) {
    const { ean, libraryId } = await request.validateUsing(storeFromEanValidator)
    const bookService = new BookService(auth)

    const book = await bookService.createFromEan(ean, libraryId)
    return response.created(book)
  }

  async storeFromUrl({ request, auth, response }: HttpContext) {
    const { url, libraryId } = await request.validateUsing(storeFromUrlValidator)
    const bookService = new BookService(auth)

    const book = await bookService.createFromUrl(url, libraryId)
    return response.created(book)
  }

  async show({ params, response, auth }: HttpContext) {
    const { id } = params
    const bookService = new BookService(auth)

    const book = await bookService.getById(id)
    return response.ok(book)
  }

  async index({ auth, response }: HttpContext) {
    const bookService = new BookService(auth)
    const books = await bookService.getUserBooks()
    return response.ok(books)
  }
}
