import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('BooksController', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    return () => db.rollbackGlobalTransaction()
  })
})
