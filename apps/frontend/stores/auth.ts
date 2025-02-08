import type { LoginCredentials, RegisterCredentials } from '~/composables/api'
import { useApi } from '~/composables/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async register(credentials: RegisterCredentials) {
      const { token } = await useApi().register(credentials)
      this.token = token.token
      localStorage.setItem('token', token.token)
    },
    async login(credentials: LoginCredentials) {
      const { token } = await useApi().login(credentials)
      this.token = token.token
      localStorage.setItem('token', token.token)
    },
    async logout() {
      await useApi().logout()
      this.token = ''
      localStorage.removeItem('token')
    },
  },
  getters: {
    isAuthenticated: state => !!state.token,
  },
})
