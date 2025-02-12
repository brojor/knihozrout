import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'failed_ean_lookups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('ean').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('error').notNullable()
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
