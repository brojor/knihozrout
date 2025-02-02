import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    // Kontrola existence emailu
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({ message: 'Email již existuje' })
    }

    // Vytvoření uživatele
    const user = await User.create(data)

    // Generování tokenu
    const token = await User.accessTokens.create(user, ['*'])

    return response.created({ user, token })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // Ověření přihlašovacích údajů
    const user = await User.verifyCredentials(email, password)

    // Generování tokenu
    const token = await User.accessTokens.create(user, ['*'])

    return response.ok({ user, token })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.noContent()
  }
}
