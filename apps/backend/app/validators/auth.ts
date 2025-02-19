import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
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
})

registerValidator.messagesProvider = messagesProvider
loginValidator.messagesProvider = messagesProvider

export { registerValidator, loginValidator }
