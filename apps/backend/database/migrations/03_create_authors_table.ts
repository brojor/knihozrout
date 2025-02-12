import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'authors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('photo_url').nullable()
      table.date('birth_date').nullable()
      table.date('death_date').nullable()
      table.text('biography').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Index pro vyhledávání podle jména
      table.index(['last_name', 'first_name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
