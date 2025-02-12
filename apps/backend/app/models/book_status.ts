import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Book from '#models/book'
import User from '#models/user'

export enum OwnershipStatus {
  OWNED = 'owned',
  WISHLIST = 'wishlist',
  TRACKED = 'tracked', // Pro knihy, které uživatel nevlastní, ale chce sledovat (např. v sérii)
}

export default class BookStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bookId: number

  @column()
  declare userId: number

  @column()
  declare status: OwnershipStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
