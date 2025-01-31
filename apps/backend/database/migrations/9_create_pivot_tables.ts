import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Vazba knih a autorů
    this.schema.createTable('author_book', (table) => {
      table.integer('author_id').unsigned().references('id').inTable('authors').notNullable()
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table.primary(['author_id', 'book_id'])
    })

    // Vazba knih a žánrů
    this.schema.createTable('book_genre', (table) => {
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table.integer('genre_id').unsigned().references('id').inTable('genres').notNullable()
      table.primary(['book_id', 'genre_id'])
    })

    // Vazba knih a knihoven
    this.schema.createTable('book_library', (table) => {
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table.integer('library_id').unsigned().references('id').inTable('libraries').notNullable()
      table.primary(['book_id', 'library_id'])
    })

    // Vazba knih a čtenářských výzev
    this.schema.createTable('book_reading_challenge', (table) => {
      table.integer('book_id').unsigned().references('id').inTable('books').notNullable()
      table
        .integer('reading_challenge_id')
        .unsigned()
        .references('id')
        .inTable('reading_challenges')
        .notNullable()
      table.boolean('completed').defaultTo(false)
      table.primary(['book_id', 'reading_challenge_id'])
    })
  }

  async down() {
    this.schema.dropTable('book_reading_challenge')
    this.schema.dropTable('book_library')
    this.schema.dropTable('book_genre')
    this.schema.dropTable('author_book')
    this.schema.dropTable('book_reading_challenge')
  }
}
