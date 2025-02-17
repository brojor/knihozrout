import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@unocss/nuxt'],
  ssr: false,
  imports: {
    dirs: ['types', 'repositories'],
  },
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  css: ['@mdi/font/css/materialdesignicons.css'],
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      baseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
    },
  },
  build: {
    analyze: true,
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    },
  },
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
})
