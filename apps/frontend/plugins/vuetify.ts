import { createVuetify } from 'vuetify'
import { VTab, VTabs, VWindow, VWindowItem } from 'vuetify/components'
import * as directives from 'vuetify/directives'

// import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VTabs,
      VTab,
      VWindow,
      VWindowItem,
    },
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
