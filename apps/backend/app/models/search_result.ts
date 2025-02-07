import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Book from '#models/book'

export default class SearchResult extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ean: number

  @column()
  declare domain: string

  @column()
  declare position: number

  @column()
  declare url: string

  @column()
  declare isSupported: boolean

  @column()
  declare bookId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>
}
