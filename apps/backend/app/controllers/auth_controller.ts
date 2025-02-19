import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Library from '#models/library'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    // Kontrola existence emailu
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({ message: 'Uživatel s tímto emailem již existuje' })
    }

    // Vytvoření uživatele
    const user = await User.create(data)

    // Vytvoření výchozí knihovny pro uživatele
    await Library.create({
      name: 'Moje knihovna',
      userId: user.id,
    })

    // Generování tokenu
    const token = await User.accessTokens.create(user, ['*'])

    return response.created({ user, token })
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user, ['*'])
      return response.ok({ user, token })
    } catch (error) {
      return response.unauthorized({
        message: 'Nesprávný email nebo heslo',
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.noContent()
  }
}
