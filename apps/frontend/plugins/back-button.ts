import { App } from '@capacitor/app'

export default defineNuxtPlugin(() => {
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back()
    }
    else {
      App.minimizeApp()
    }
  })
})
