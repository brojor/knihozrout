import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class FailedEanLookup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ean: string

  @column()
  declare userId: number

  @column()
  declare error: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
} 