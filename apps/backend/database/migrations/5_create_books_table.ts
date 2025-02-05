import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('subtitle').nullable()
      table.integer('publication_year').nullable()
      table.string('cover_image').nullable()
      table.integer('page_count').nullable()
      table.string('language', 2).notNullable()
      table.bigInteger('ean').nullable()
      table.string('publisher').nullable()
      table.integer('series_id').unsigned().references('id').inTable('series').nullable()
      table.integer('series_order').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('library_id').unsigned().references('id').inTable('libraries').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
