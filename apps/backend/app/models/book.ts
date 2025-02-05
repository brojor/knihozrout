import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Author from '#models/author'
import Genre from '#models/genre'
import Series from '#models/series'
import Library from '#models/library'
import ReadingChallenge from '#models/reading_challenge'
import ReadingState from '#models/reading_state'
import ReadingSession from '#models/reading_session'
import BookLoan from '#models/book_loan'

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
  declare language: string

  @column()
  declare ean: number | null

  @column()
  declare publisher: string | null

  @column()
  declare seriesId: number | null

  @column()
  declare seriesOrder: number | null

  @column()
  declare userId: number

  @column()
  declare libraryId: number | null

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

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Series)
  declare series: BelongsTo<typeof Series>

  @manyToMany(() => Author)
  declare authors: ManyToMany<typeof Author>

  @manyToMany(() => Genre)
  declare genres: ManyToMany<typeof Genre>

  @belongsTo(() => Library)
  declare library: BelongsTo<typeof Library>

  @manyToMany(() => ReadingChallenge, {
    pivotTable: 'book_reading_challenge',
    pivotColumns: ['completed'],
  })
  declare readingChallenges: ManyToMany<typeof ReadingChallenge>

  @hasMany(() => ReadingState)
  declare readingStates: HasMany<typeof ReadingState>

  @hasMany(() => ReadingSession)
  declare readingSessions: HasMany<typeof ReadingSession>

  @hasMany(() => BookLoan)
  declare loans: HasMany<typeof BookLoan>

  @hasOne(() => ReadingState)
  declare readingState: HasOne<typeof ReadingState>
}
