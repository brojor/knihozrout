import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'font-size': '1.3em',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      customFetch: (url) => {
        return fetch(url).then(res => res.text())
      },
      fonts: {
        sans: {
          name: 'Inter',
          weights: ['400', '500', '700'],
        },
      },
    }),
    // ...other presets
  ],
  theme: {
    colors: {
      'base-gray': '#4B5563',
    },
  },
  safelist: ['font-sans'],
})
