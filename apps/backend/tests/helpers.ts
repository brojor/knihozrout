import User from '#models/user'
import { UserFactory } from '#database/factories/user_factory'

export async function createAuthenticatedUser() {
  const user = await UserFactory.create()
  const token = await User.accessTokens.create(user, ['*'])
  return { user, token }
}
