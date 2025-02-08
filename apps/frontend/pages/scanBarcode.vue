<script lang="ts" setup>
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner'

const scanResult = ref<string | null>(null)
const book = ref<any | null>(null)
const isLoading = ref(false)
const errors = ref<string[]>([])

async function startScanning() {
  errors.value = []
  try {
    const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.EAN_13,
      scanInstructions: 'Naskenujte čárový kód knihy',
    })
    scanResult.value = ScanResult
  }
  catch (error) {
    console.error('Chyba při skenování:', error)
    errors.value.push(`Chyba při skenování: ${error}`)
  }
}

async function fetchBookByEAN() {
  isLoading.value = true

  if (!scanResult.value) {
    console.error('Žádný čárový kód nebyl naskenován')
    errors.value.push('Žádný čárový kód nebyl naskenován')
    return
  }

  try {
    const response = await useApi().fetchBookByEAN(scanResult.value)
    book.value = response
  }
  catch (error) {
    const err = error as { response?: { status: number, _data?: { error?: string } } }

    console.error('Status kód:', err.response?.status)
    console.error('Chybová zpráva:', err.response?._data?.error)
    errors.value.push(`${err.response?.status}: ${err.response?._data?.error}` || 'Neznámá chyba')
  }
  finally {
    isLoading.value = false
  }
}

watch(scanResult, (newVal) => {
  if (newVal) {
    fetchBookByEAN()
  }
})

onMounted(() => {
  startScanning()
})
</script>

<template>
  <div>
    <h1>Skenování čárového kódu</h1>
    <!-- spinning loader with text "Prohledávám internet" -->
    <div v-if="isLoading" class="scan-barcode">
      <p>Prohledávám internet</p>
      <div class="loader" />
    </div>

    <!-- show book details -->
    <div v-else-if="book">
      <pre>
            <code>
                {{ JSON.stringify(book, null, 2) }}
            </code>
        </pre>
    </div>
    <ul v-if="errors.length > 0" class="errors">
      <li v-for="error in errors" :key="error">
        {{ error }}
      </li>
    </ul>
    <button @click="startScanning">
      Skenovat znovu
    </button>
  </div>
</template>

<style scoped>
.scan-barcode {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
button {
    margin: 16px 0;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
}

.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.errors {
  color: red;
}
</style>
