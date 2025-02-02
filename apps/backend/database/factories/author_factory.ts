import factory from '@adonisjs/lucid/factories'
import Author from '#models/author'
import { DateTime } from 'luxon'

export const AuthorFactory = factory
  .define(Author, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      photoUrl: faker.helpers.maybe(() => faker.image.avatar()),
      birthDate: faker.helpers.maybe(() => DateTime.fromJSDate(faker.date.past())),
      deathDate: faker.helpers.maybe(() => DateTime.fromJSDate(faker.date.past())),
      biography: faker.helpers.maybe(() => faker.lorem.paragraphs(2)),
    }
  })
  .build()
