export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    setAuth(authData: AuthResponse) {
      this.token = authData.token.token
      this.user = authData.user
      localStorage.setItem('auth_token', authData.token.token)
      localStorage.setItem('user', JSON.stringify(authData.user))
    },

    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },

    async login(credentials: LoginCredentials) {
      const authRepository = new AuthRepository()
      const { data, error } = await authRepository.login(credentials)

      if (error)
        throw new Error(error)
      if (!data)
        throw new Error('No data returned from login')

      this.setAuth(data)
    },

    async register(credentials: RegisterCredentials) {
      const authRepository = new AuthRepository()
      const { data, error } = await authRepository.register(credentials)

      if (error)
        throw new Error(error)
      if (!data)
        throw new Error('No data returned from register')

      this.setAuth(data)
    },

    async logout() {
      const authRepository = new AuthRepository()
      await authRepository.logout()
      this.clearAuth()
      navigateTo('/login')
    },
  },
})
