export default defineNuxtPlugin((nuxtApp) => {
  const userAuth = useCookie('token')
  const config = useRuntimeConfig()

  const $customFetch = $fetch.create({
    baseURL: config.public.baseUrl ?? 'https://api.nuxt.com',
    onRequest({ options }) {
      if (userAuth.value) {
        options.headers.set('Authorization', `Bearer ${userAuth.value}`)
      }
    },
    onResponseError({ response }) {
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
