import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Author from '#models/author'
import Genre from '#models/genre'
import Series from '#models/series'
import ReadingState from '#models/reading_state'
import ReadingSession from '#models/reading_session'
import BookLoan from '#models/book_loan'
import BookStatus from '#models/book_status'
import Library from '#models/library'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare subtitle: string | null

  @column()
  declare publicationYear: number | null

  @column()
  declare coverImage: string | null

  @column()
  declare pageCount: number | null

  @column()
  declare language: string | null

  @column()
  declare ean: number | null

  @column()
  declare publisher: string | null

  @column()
  declare originalTitle: string | null

  @column()
  declare originalLanguage: string | null

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Author)
  declare authors: ManyToMany<typeof Author>

  @manyToMany(() => Genre)
  declare genres: ManyToMany<typeof Genre>

  @manyToMany(() => Series, {
    pivotTable: 'book_series',
    pivotColumns: ['order', 'user_id'],
  })
  declare series: ManyToMany<typeof Series>

  @hasMany(() => ReadingState)
  declare readingStates: HasMany<typeof ReadingState>

  @hasMany(() => ReadingSession)
  declare readingSessions: HasMany<typeof ReadingSession>

  @hasMany(() => BookLoan)
  declare loans: HasMany<typeof BookLoan>

  @hasMany(() => BookStatus)
  declare bookStatuses: HasMany<typeof BookStatus>

  @manyToMany(() => Library, {
    pivotTable: 'book_library',
  })
  declare libraries: ManyToMany<typeof Library>
}
