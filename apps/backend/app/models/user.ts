import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Book from '#models/book'
import Library from '#models/library'
import ReadingState from '#models/reading_state'
import ReadingSession from '#models/reading_session'
import ReadingChallenge from '#models/reading_challenge'
import BookLoan from '#models/book_loan'
import Series from '#models/series'
import BookStatus from '#models/book_status'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Book)
  declare books: HasMany<typeof Book>

  @hasMany(() => Library)
  declare libraries: HasMany<typeof Library>

  @hasMany(() => ReadingState)
  declare readingStates: HasMany<typeof ReadingState>

  @hasMany(() => ReadingSession)
  declare readingSessions: HasMany<typeof ReadingSession>

  @hasMany(() => ReadingChallenge)
  declare readingChallenges: HasMany<typeof ReadingChallenge>

  @hasMany(() => BookLoan)
  declare bookLoans: HasMany<typeof BookLoan>

  @hasMany(() => Series)
  declare series: HasMany<typeof Series>

  @hasMany(() => BookStatus)
  declare bookStatuses: HasMany<typeof BookStatus>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
