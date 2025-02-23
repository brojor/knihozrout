import { Exception } from '@adonisjs/core/exceptions'

export default class BookNotFoundException extends Exception {
  static status = 404
  static code = 'E_BOOK_NOT_FOUND'

  constructor(message: string) {
    super(message)
  }
}
