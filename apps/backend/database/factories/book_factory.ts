import factory from '@adonisjs/lucid/factories'
import Book from '#models/book'
import { UserFactory } from '#factories/user_factory'
import { LibraryFactory } from '#factories/library_factory'
import { AuthorFactory } from '#factories/author_factory'
import { GenreFactory } from '#factories/genre_factory'
import { SUPPORTED_LANGUAGES } from '#constants/languages'

export const BookFactory = factory
  .define(Book, async ({ faker }) => {
    return {
      title: faker.lorem.words(3),
      subtitle: faker.helpers.maybe(() => faker.lorem.sentence()),
      publicationYear: faker.number.int({ min: 1900, max: 2024 }),
      coverImage: faker.helpers.maybe(() => faker.image.url()),
      pageCount: faker.number.int({ min: 50, max: 1000 }),
      language: faker.helpers.arrayElement(SUPPORTED_LANGUAGES),
      isbn: faker.helpers.maybe(() => faker.string.numeric(13)),
      publisher: faker.company.name(),
    }
  })
  .relation('user', () => UserFactory)
  .relation('library', () => LibraryFactory)
  .relation('authors', () => AuthorFactory)
  .relation('genres', () => GenreFactory)
  .build()
