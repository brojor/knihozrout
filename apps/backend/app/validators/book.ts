import vine from '@vinejs/vine'

/**
 * Validátor pro vytvoření knihy
 */
export const createBookValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    subtitle: vine.string().trim().nullable(),
    publicationYear: vine.number().positive().nullable(),
    coverImage: vine.string().trim().url().nullable(),
    pageCount: vine.number().positive().nullable(),
    language: vine.string().trim().minLength(3).maxLength(3).nullable(),
    isbn: vine.string().trim().nullable(),
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
