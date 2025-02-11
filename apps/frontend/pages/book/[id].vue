<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const book = computed(() => booksStore.currentBook)
const isLoading = ref(!book.value)
const error = ref<string | null>(null)

async function fetchBook() {
  if (book.value?.id === Number(route.params.id))
    return

  try {
    isLoading.value = true
    const response = await useApi().fetchBook(Number(route.params.id))
    booksStore.setCurrentBook(response)
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
  fetchBook()
})

onUnmounted(() => {
  booksStore.clearCurrentBook()
})
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <p>Načítám detail knihy</p>
      <div class="loader" />
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="book" class="book-detail">
      <div class="main-info">
        <div class="main-info__image">
          <img v-if="book.coverImage" :src="book.coverImage" :alt="book.title">
          <div v-else class="main-info__image-placeholder" />
        </div>

        <div class="main-info__content">
          <h1>{{ book.title }}</h1>
          <p v-if="book.subtitle">
            {{ book.subtitle }}
          </p>
          <p>Autor: {{ book.authors.map((author) => author.fullName).join(', ') }}</p>
          <p v-if="book.publicationYear">
            Rok vydání: {{ book.publicationYear }}
          </p>
          <p v-if="book.pageCount">
            Počet stran: {{ book.pageCount }}
          </p>
          <p v-if="book.language">
            Jazyk: {{ book.language }}
          </p>
          <p v-if="book.publisher">
            Vydavatel: {{ book.publisher }}
          </p>
        </div>
      </div>
      <div class="book-detail__description">
        <p v-if="book.description">
          {{ book.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.book-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-info {
  display: flex;
  gap: 20px;
  height: 33vh;
  margin-bottom: 20px;
}

.main-info__image {
  max-width: 200px;
  aspect-ratio: 2/3;
  border-radius: 10px;
  overflow: hidden;
}

.main-info__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-info__image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #888080;
  border-radius: 10px;
  border: 1px solid #000000;
}

.main-info__content {
  flex: 1;
}

.main-info__content h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.main-info__content p {
  margin: 5px 0;
}

.book-detail__description {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: red;
  text-align: center;
}
</style>
