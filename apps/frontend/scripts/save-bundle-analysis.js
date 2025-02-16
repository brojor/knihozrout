// scripts/save-bundle-analysis.js
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const analyzeDir = join(__dirname, '../.nuxt/analyze')
const targetDir = join(__dirname, '../bundle-analysis', timestamp)

try {
  // Vytvoření složky s timestampem
  mkdirSync(targetDir, { recursive: true })

  // Kopírování souborů
  copyFileSync(
    join(analyzeDir, 'client.html'),
    join(targetDir, 'client.html'),
  )

  copyFileSync(
    join(analyzeDir, 'nitro.html'),
    join(targetDir, 'nitro.html'),
  )

  console.log(`Bundle analysis saved to: ${targetDir}`)
}
catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Source files not found. Make sure the bundle analysis was generated first.')
    console.error('Looking for files in:', analyzeDir)
  }
  else {
    console.error('Error copying files:', error)
  }
}
