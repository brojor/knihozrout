<script lang="ts" setup>
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner'

const { $customFetch } = useNuxtApp()

const scanResult = ref<string | null>(null)
const book = ref<any | null>(null)
const isLoading = ref(false)
async function startScanning() {
  const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
    hint: CapacitorBarcodeScannerTypeHint.EAN_13,
    scanInstructions: 'Naskenujte čárový kód knihy',
  })

  scanResult.value = ScanResult
}

async function fetchBook() {
  isLoading.value = true

  // make post request to api/books/from-ean
  const response = await $customFetch('/api/books/from-ean', {
    method: 'POST',
    body: {
      ean: scanResult.value,
    },
  })

  isLoading.value = false
  console.log(response)
  book.value = response.data
}

watch(scanResult, (newVal) => {
  if (newVal) {
    fetchBook()
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
