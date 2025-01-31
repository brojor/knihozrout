import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'book_loans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.string('borrower_name').notNullable()
      table.text('note').nullable()
      table.timestamp('borrowed_at').notNullable()
      table.timestamp('returned_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
