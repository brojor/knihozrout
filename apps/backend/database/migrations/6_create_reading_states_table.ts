import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reading_states'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table
        .enum('status', ['unread', 'reading', 'read', 'paused', 'want_to_read', 'wishlist'])
        .notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['book_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
