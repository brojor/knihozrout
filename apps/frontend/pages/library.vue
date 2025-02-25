<script setup lang="ts">
const router = useRouter()
const notifications = useNotificationsStore()

const books = shallowRef<Book[]>([])
const loading = ref<boolean>(true)
const bookRepository = new BookRepository()
// Simulace načtení dat z API
async function fetchBooks() {
  loading.value = true

  try {
    books.value = await bookRepository.fetchBooks()
  }
  catch {
    notifications.error('Načítání knih se nezdařilo')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBooks()
})

function scan() {
  router.push('/scanBarcode')
}

function manual() {
  notifications.warning('Manual entry not implemented')
}
</script>

<template>
  <main class="h-full overflow-hidden relative py-3">
    <!-- Načítání -->
    <div v-if="loading" class="h-full w-full flex-center">
      <div class="text-blue-500 i-carbon-circle-dash animate-spin text-3xl" />
    </div>

    <!-- Prázdný stav -->
    <div v-else-if="books.length === 0" class="h-full w-full flex-center flex-col p-4">
      <div class="i-carbon-notebook text-5xl text-gray-400 mb-4" />
      <p class="text-gray-500 text-center">
        Zatím nemáš v knihovně žádné knihy
      </p>
    </div>

    <!-- Zobrazení knih -->
    <LibraryGrid
      v-else
      :books="books"
      class="h-full"
    />
    <FloatingActionButton @scan="scan" @manual="manual" />
  </main>
</template>
