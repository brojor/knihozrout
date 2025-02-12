import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { SUPPORTED_LANGUAGES } from '#constants/languages'

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
      .transform((value) => value.toLowerCase())
      .optional(),
    originalLanguage: vine
      .string()
      .trim()
      .in([...SUPPORTED_LANGUAGES])
      .transform((value) => value.toLowerCase())
      .optional(),
    ean: vine.number().positive(),
    publisher: vine.string().trim().optional(),
  })
)

const messagesProvider = new SimpleMessagesProvider({
  'ean.range': 'Pole {{ field }} musí mít 13 číslic a začínat na 978 nebo 979.',
})

const eanValidator = vine.compile(
  vine.object({
    ean: vine.number().range([9780000000000, 9799999999999]),
  })
)

eanValidator.messagesProvider = messagesProvider
export { eanValidator }
