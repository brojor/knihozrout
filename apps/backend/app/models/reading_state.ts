import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Book from '#models/book'

export enum ReadingStatus {
  UNREAD = 'unread',
  READING = 'reading',
  READ = 'read',
  PAUSED = 'paused',
  WANT_TO_READ = 'want_to_read',
  WISHLIST = 'wishlist',
  NOT_OWNED = 'not_owned',
}

export default class ReadingState extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bookId: number

  @column()
  declare status: ReadingStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>
}
