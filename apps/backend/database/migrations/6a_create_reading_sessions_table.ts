import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reading_sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()

      table.timestamp('started_at').notNullable()
      table.timestamp('finished_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['book_id', 'user_id', 'started_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
