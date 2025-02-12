import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reading_progress'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('reading_session_id')
        .unsigned()
        .references('id')
        .inTable('reading_sessions')
        .notNullable()

      table.integer('page').notNullable()
      table.timestamp('created_at').notNullable()

      table.index(['reading_session_id', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
