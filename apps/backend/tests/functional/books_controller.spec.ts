import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import { UserFactory } from '#database/factories/user_factory'
import { BookFactory } from '#database/factories/book_factory'
import { AuthorFactory } from '#database/factories/author_factory'
import { GenreFactory } from '#database/factories/genre_factory'
import { LibraryFactory } from '#database/factories/library_factory'

test.group('BooksController', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    return () => db.rollbackGlobalTransaction()
  })
})
