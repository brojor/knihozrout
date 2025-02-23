<script lang="ts" setup>
import type { ApiError } from '~/types/api'
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

interface ScanError {
  message: string
  code: string
}

interface ScanResponse {
  ScanResult: string | ScanError
}

const scanResult = ref<number | null>(null)
const isLoading = ref(false)
const showError = ref(false)
const errorState = ref<{
  title: string
  message: string
  primaryAction: { label: string, handler: () => void }
  secondaryAction?: { label: string, handler: () => void }
} | null>(null)

const router = useRouter()
const booksStore = useBooksStore()

function isValidEAN13(ean: string): boolean {
  if (!/^\d{13}$/.test(ean))
    return false

  const digits = ean.split('').map(Number)
  const checksum = digits.pop()!

  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3)
  }, 0)

  const calculatedChecksum = (10 - (sum % 10)) % 10
  return calculatedChecksum === checksum
}

async function startScanning() {
  try {
    const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.EAN_13,
      scanInstructions: 'Naskenujte čárový kód knihy',
    }) as ScanResponse

    await Haptics.impact({ style: ImpactStyle.Medium })

    if (typeof ScanResult === 'object') {
      if (ScanResult.code === 'OS-PLUG-BARC-0007') {
        errorState.value = {
          title: 'Přístup ke kameře',
          message: 'Pro naskenování knihy potřebujeme přístup ke kameře.',
          primaryAction: {
            label: 'Zadat ručně',
            handler: () => navigateTo('/manual-input'),
          },
          secondaryAction: {
            label: 'Zpět',
            handler: () => router.back(),
          },
        }
        showError.value = true
        return
      }

      if (ScanResult.code === 'OS-PLUG-BARC-0006') {
        router.back()
        return
      }

      console.error('Chyba při skenování:', ScanResult)
      errorState.value = {
        title: 'Chyba skenování',
        message: 'Nepodařilo se naskenovat čárový kód.',
        primaryAction: {
          label: 'Zkusit znovu',
          handler: () => {
            showError.value = false
            startScanning()
          },
        },
        secondaryAction: {
          label: 'Zadat ručně',
          handler: () => navigateTo('/manual-input'),
        },
      }
      showError.value = true
      return
    }

    // Validace EAN kódu
    if (!isValidEAN13(ScanResult)) {
      errorState.value = {
        title: 'Neplatný čárový kód',
        message: 'Naskenovaný kód není platný EAN-13.',
        primaryAction: {
          label: 'Zkusit znovu',
          handler: () => {
            showError.value = false
            startScanning()
          },
        },
        secondaryAction: {
          label: 'Zpět',
          handler: () => router.back(),
        },
      }
      showError.value = true
      return
    }

    scanResult.value = Number.parseInt(ScanResult)
  }
  catch (error) {
    await Haptics.impact({ style: ImpactStyle.Medium })
    console.error('Neočekávaná chyba při skenování:', error)
    errorState.value = {
      title: 'Neočekávaná chyba',
      message: 'Nastala neočekávaná chyba při skenování.',
      primaryAction: {
        label: 'Zkusit znovu',
        handler: () => {
          showError.value = false
          startScanning()
        },
      },
      secondaryAction: {
        label: 'Zpět',
        handler: () => router.back(),
      },
    }
    showError.value = true
  }
}

async function fetchBookByEAN() {
  isLoading.value = true
  const bookRepository = new BookRepository()

  try {
    const data = await bookRepository.fetchBookByEAN(scanResult.value!)
    booksStore.setCurrentBook(data)
    router.push(`/book/${data.id}`)
  }
  catch (error) {
    const apiError = error as ApiError

    if (apiError.status === 404) {
      errorState.value = {
        title: 'Kniha nenalezena',
        message: 'Informace o knize se nepodařilo najít. Váš požadavek byl zaznamenán a při příštím pokusu o naskenování už by informace mohly být k dispozici.',
        primaryAction: {
          label: 'Zadat ručně',
          handler: () => navigateTo({
            path: '/manual-add',
            query: { ean: scanResult.value?.toString() },
          }),
        },
        secondaryAction: {
          label: 'Zpět',
          handler: () => router.back(),
        },
      }
      showError.value = true
      return
    }

    if (apiError.status === 409) {
      errorState.value = {
        title: 'Kniha již existuje',
        message: 'Tato kniha je již ve vaší knihovně.',
        primaryAction: {
          label: 'Zobrazit knihu',
          handler: () => navigateTo({
            path: `/book/${apiError.data?.bookId}`,
          }),
        },
        secondaryAction: {
          label: 'Přejít do knihovny',
          handler: () => navigateTo({
            path: `/library/${apiError.data?.libraryId}`,
          }),
        },
      }
      showError.value = true
      return
    }

    // Ostatní chyby (síťové, server) jsou zpracovány v BaseRepository
    router.back()
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
  <div class="p-4 flex flex-col items-center flex-1">
    <template v-if="!showError">
      <h1 class="text-2xl font-bold mb-8">
        Skenování čárového kódu
      </h1>
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <p class="text-lg">
          Prohledávám internet
        </p>
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </template>

    <div v-else class="flex flex-col items-center text-center">
      <h2 class="text-xl font-semibold mb-4">
        {{ errorState?.title }}
      </h2>
      <p class="text-gray-600 mb-8">
        {{ errorState?.message }}
      </p>
      <div class="flex flex-col gap-3 w-full max-w-xs">
        <button
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          @click="errorState?.primaryAction.handler"
        >
          {{ errorState?.primaryAction.label }}
        </button>
        <button
          v-if="errorState?.secondaryAction"
          class="w-full px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          @click="errorState?.secondaryAction.handler"
        >
          {{ errorState?.secondaryAction.label }}
        </button>
      </div>
    </div>
  </div>
</template>
