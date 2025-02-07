import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'search_results'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('ean').notNullable()
      table.string('domain').notNullable()
      table.integer('position').notNullable()
      table.string('url').notNullable()
      table.boolean('is_supported').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Indexy pro rychlé vyhledávání
      table.index(['ean'])
      table.index(['domain'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
