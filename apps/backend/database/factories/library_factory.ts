import factory from '@adonisjs/lucid/factories'
import Library from '#models/library'
import { UserFactory } from '#factories/user_factory'

export const LibraryFactory = factory
  .define(Library, async ({ faker }) => {
    return {
      name: faker.lorem.words(2),
      description: faker.helpers.maybe(() => faker.lorem.paragraph()),
    }
  })
  .relation('user', () => UserFactory)
  .build()
