export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const $customFetch = $fetch.create({
    baseURL: config.public.baseUrl ?? 'https://api.nuxt.com',
    onRequest({ options }: { options: RequestInit }) {
      if (auth.isAuthenticated) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`,
        }
      }
    },
    onResponseError({ response }: { response: Response }) {
      if (response.status === 401) {
        nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return {
    provide: {
      customFetch: $customFetch,
    },
  }
})
