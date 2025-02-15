export class AuthRepository extends BaseRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.call<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.call<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials,
    })
  }

  async logout(): Promise<void> {
    return this.call('/auth/logout', {
      method: 'POST',
    })
  }
}
