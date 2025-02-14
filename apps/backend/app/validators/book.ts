import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { SUPPORTED_LANGUAGES } from '#constants/languages'

const languageRules = vine
  .string()
  .trim()
  .in([...SUPPORTED_LANGUAGES])
  .transform((value) => value.toLowerCase())
  .optional()

const eanRules = vine.number().range([9780000000000, 9799999999999])

const createBookValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    originalTitle: vine.string().trim().optional(),
    subtitle: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    publicationYear: vine.number().positive().optional(),
    coverImage: vine.string().trim().url().optional(),
    pageCount: vine.number().positive().optional(),
    language: languageRules,
    originalLanguage: languageRules,
    ean: eanRules,
    publisher: vine.string().trim().optional(),
    authors: vine
      .array(
        vine.object({
          firstName: vine.string().trim().minLength(1).maxLength(255),
          lastName: vine.string().trim().minLength(1).maxLength(255),
        })
      )
      .minLength(1),
  })
)

const storeFromEanValidator = vine.compile(
  vine.object({
    ean: eanRules,
    libraryId: vine.number().positive().optional(),
  })
)

const storeFromUrlValidator = vine.compile(
  vine.object({
    url: vine.string().trim().url(),
    libraryId: vine.number().positive().optional(),
  })
)

const messagesProvider = new SimpleMessagesProvider({
  'ean.range': 'Pole {{ field }} musí mít 13 číslic a začínat na 978 nebo 979.',
})

createBookValidator.messagesProvider = messagesProvider
storeFromEanValidator.messagesProvider = messagesProvider

export { createBookValidator, storeFromEanValidator, storeFromUrlValidator }
