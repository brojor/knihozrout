// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@unocss/nuxt'],
  ssr: false,
  imports: {
    dirs: ['types', 'repositories'],
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      baseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
    },
  },
  build: {
    analyze: true,
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
})
