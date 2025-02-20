<script lang="ts" setup>
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const scanResult = ref<number | null>(null)
const isLoading = ref(false)
const router = useRouter()
const booksStore = useBooksStore()

async function startScanning() {
  try {
    const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.EAN_13,
      scanInstructions: 'Naskenujte čárový kód knihy',
    })
    await Haptics.impact({ style: ImpactStyle.Light })
    scanResult.value = Number.parseInt(ScanResult)
  }
  catch (error) {
    console.error('Chyba při skenování:', error)
  }
}

async function fetchBookByEAN() {
  isLoading.value = true

  if (!scanResult.value) {
    console.error('Žádný čárový kód nebyl naskenován')
    return
  }

  const bookRepository = new BookRepository()

  try {
    const data = await bookRepository.fetchBookByEAN(scanResult.value)
    booksStore.setCurrentBook(data)
    router.push(`/book/${data.id}`)
  }
  catch (error) {
    console.error('Chyba při získávání knihy:', error)
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
    <div v-if="isLoading" class="scan-barcode">
      <p>Prohledávám internet</p>
      <div class="loader" />
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
