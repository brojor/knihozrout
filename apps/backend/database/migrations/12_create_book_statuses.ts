import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'book_statuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().references('books.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('status').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Zajistí, že kombinace book_id a user_id bude unikátní
      table.unique(['book_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
