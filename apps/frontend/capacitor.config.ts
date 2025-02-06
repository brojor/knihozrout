import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'knihozrout',
  webDir: '.output/public',
  android: {
    allowMixedContent: true,
  },
}

export default config
