import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, computed } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Book from '#models/book'

export default class Author extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare photoUrl: string | null

  @column.date()
  declare birthDate: DateTime | null

  @column.date()
  declare deathDate: DateTime | null

  @column()
  declare biography: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Book)
  declare books: ManyToMany<typeof Book>

  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @computed()
  get sortableName() {
    return `${this.lastName}, ${this.firstName}`
  }

  /**
   * Vrátí jméno autora v požadovaném formátu
   * @param format 'natural' pro běžné zobrazení, 'sortable' pro řazení podle příjmení
   */
  getFormattedName(format: 'natural' | 'sortable' = 'natural'): string {
    return format === 'natural' ? this.fullName : this.sortableName
  }
}
