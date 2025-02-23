import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .normalizeEmail()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    password: vine.string().minLength(8),
    fullName: vine.string().trim().minLength(1).maxLength(30),
  })
)

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string(),
  })
)

const messagesProvider = new SimpleMessagesProvider({
  'email': 'Zadej prosím platnou emailovou adresu',
  'password': 'Heslo musí být alespoň 8 znaků dlouhé',
  'fullName.minLength': 'Zadej prosím tvé jméno',
  'fullName.maxLength': 'Jméno je příliš dlouhé',
  'database.unique': 'Uživatel s tímto emailem již existuje',
})

registerValidator.messagesProvider = messagesProvider
loginValidator.messagesProvider = messagesProvider

export { registerValidator, loginValidator }
