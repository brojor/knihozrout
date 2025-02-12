import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Book from '#models/book'
import User from '#models/user'

export default class Series extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare plannedBooksCount: number | null

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Book, {
    pivotTable: 'book_series',
    pivotColumns: ['order'],
  })
  declare books: ManyToMany<typeof Book>
}
