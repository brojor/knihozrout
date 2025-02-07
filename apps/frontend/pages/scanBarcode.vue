<script lang="ts" setup>
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner'

const { $customFetch } = useNuxtApp()

const scanResult = ref<string | null>(null)
const book = ref<any | null>(null)
const isLoading = ref(false)

async function startScanning() {
  try {
    const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.EAN_13,
      scanInstructions: 'Naskenujte čárový kód knihy',
    })
    scanResult.value = ScanResult
  }
  catch (error) {
    console.error('Chyba při skenování:', error)
  }
}

async function fetchBookByEAN() {
  isLoading.value = true
  try {
    const response = await $customFetch('/api/books/from-ean', {
      method: 'POST',
      body: { ean: scanResult.value },
    })
    if (response.data) {
      book.value = response.data
    }
    else {
      console.error('Žádná data nebyla vrácena')
    }
  }
  catch (error) {
    console.error('Chyba při načítání knihy:', error)
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
</style>
