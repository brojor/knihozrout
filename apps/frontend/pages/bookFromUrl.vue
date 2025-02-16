<script setup lang="ts">
import { useBooksStore } from '~/stores/books'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const error = ref<string | null>(null)
const booksStore = useBooksStore()
const bookRepository = new BookRepository()
async function fetchBookFromUrl() {
  const url = route.query.url as string

  if (!url) {
    error.value = 'Nebyla poskytnuta URL adresa'
    return
  }

  try {
    const response = await bookRepository.fetchBookFromUrl(url)
    booksStore.setCurrentBook(response)
    router.push(`/book/${response.id}`)
  }
  catch (e: any) {
    error.value = e.response?._data?.error || 'Nepodařilo se načíst knihu'
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push('/')
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBookFromUrl()
})
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <p>Prohledávám internet</p>
      <div class="loader" />
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading {
  text-align: center;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: red;
  text-align: center;
  padding: 20px;
}
</style>
