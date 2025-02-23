import { Exception } from '@adonisjs/core/exceptions'

export default class BookAlreadyExistsException extends Exception {
  static status = 409
  static code = 'E_BOOK_ALREADY_EXISTS'

  constructor(
    message: string,
    public data: { bookId: number; libraryId: number }
  ) {
    super(message)
  }
}
