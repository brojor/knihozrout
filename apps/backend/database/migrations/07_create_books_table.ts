import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('original_title').nullable()
      table.string('subtitle').nullable()
      table.text('description').nullable()
      table.integer('publication_year').nullable()
      table.string('cover_image').nullable()
      table.integer('page_count').nullable()
      table.string('language', 2).nullable()
      table.string('original_language', 2).nullable()
      table.bigInteger('ean').nullable()
      table.string('publisher').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
