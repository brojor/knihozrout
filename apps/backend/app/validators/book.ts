import vine from '@vinejs/vine'
import { ReadingStatus } from '#models/reading_state'
import { SUPPORTED_LANGUAGES } from '#constants/languages'

/**
 * Validátor pro vytvoření knihy
 */
export const createBookValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    originalTitle: vine.string().trim().nullable(),
    subtitle: vine.string().trim().nullable(),
    description: vine.string().trim().nullable(),
    publicationYear: vine.number().positive().nullable(),
    coverImage: vine.string().trim().url().nullable(),
    pageCount: vine.number().positive().nullable(),
    language: vine
      .string()
      .trim()
      .in([...SUPPORTED_LANGUAGES])
      .transform((value) => value.toLowerCase()),
    originalLanguage: vine
      .string()
      .trim()
      .in([...SUPPORTED_LANGUAGES])
      .transform((value) => value.toLowerCase())
      .nullable(),
    ean: vine.number().positive().nullable(),
    publisher: vine.string().trim().nullable(),
    seriesId: vine.number().positive().nullable(),
    seriesOrder: vine.number().positive().nullable(),
    libraryId: vine.number().positive().nullable(),
    authors: vine
      .array(
        vine.object({
          firstName: vine.string().trim().minLength(1).maxLength(255),
          lastName: vine.string().trim().minLength(1).maxLength(255),
        })
      )
      .minLength(1),
    genres: vine.array(vine.string().trim()).minLength(1),
  })
)

/**
 * Validátor pro stránkování
 */
export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    limit: vine.number().positive().optional(),
  })
)

/**
 * Validátor pro řazení
 */
export const sortValidator = vine.compile(
  vine.object({
    sort: vine
      .enum(['title', 'authorLastName', 'authorFirstName', 'publicationYear', 'pageCount'] as const)
      .optional(),
    direction: vine.enum(['asc', 'desc'] as const).optional(),
  })
)

/**
 * Validátor pro filtrování
 */
export const filterValidator = vine.compile(
  vine.object({
    language: vine.string().trim().minLength(3).maxLength(3).optional(),
    libraryId: vine.number().positive().optional(),
    authorId: vine.number().positive().optional(),
    genreId: vine.number().positive().optional(),
    readingStatus: vine.enum(Object.values(ReadingStatus)).optional(),
    series: vine.number().positive().optional(),
  })
)

export const scrapedBookValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    originalTitle: vine.string().trim().optional(),
    subtitle: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    publicationYear: vine.number().positive().optional(),
    coverImage: vine.string().trim().url().optional(),
    pageCount: vine.number().positive().optional(),
    language: vine
      .string()
      .trim()
      .in([...SUPPORTED_LANGUAGES])
      .transform((value) => value.toLowerCase()),
    originalLanguage: vine
      .string()
      .trim()
      .in([...SUPPORTED_LANGUAGES])
      .transform((value) => value.toLowerCase())
      .optional(),
    ean: vine.number().positive(),
    publisher: vine.string().trim().optional(),
    userId: vine.number().positive(),
    libraryId: vine.number().positive(),
  })
)
