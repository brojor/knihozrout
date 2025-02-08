import type { FetchOptions, FetchResponse } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const $customFetch = $fetch.create({
    baseURL: config.public.baseUrl ?? 'https://api.nuxt.com',
    onRequest({ options }: { options: FetchOptions }) {
      options.cache = 'no-cache'
      if (auth.isAuthenticated) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`,
        }
      }
    },
    onResponseError({ response, options }: { response: FetchResponse<unknown>, options: FetchOptions }) {
      if (response.status === 401) {
        nuxtApp.runWithContext(() => navigateTo('/login'))
      }
      options.cache = 'no-cache'
    },
  })

  return {
    provide: {
      customFetch: $customFetch,
    },
  }
})
