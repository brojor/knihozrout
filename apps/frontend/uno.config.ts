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
  shortcuts: {
    'fab-base': 'w-[12vw] h-[12vw] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
    'fab-action': 'fab-base absolute right-0 text-white shadow-lg',
  },
  safelist: ['font-sans'],
})
