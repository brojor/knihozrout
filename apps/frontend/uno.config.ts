import { defineConfig, presetIcons, presetUno } from 'unocss'

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
    // ...other presets
  ],
  theme: {
    colors: {
      'base-gray': '#4B5563',
    },
  },
})
