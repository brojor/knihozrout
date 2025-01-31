import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ReadingSession from '#models/reading_session'

export default class ReadingProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare readingSessionId: number

  @column()
  declare page: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => ReadingSession)
  declare readingSession: BelongsTo<typeof ReadingSession>
}
