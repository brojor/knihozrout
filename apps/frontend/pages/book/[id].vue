<script setup lang="ts">
import { LANGUAGE_NAMES } from '~/constants/languageNames'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const book = computed(() => booksStore.currentBook)
const isLoading = ref(!book.value)
const bookRepository = new BookRepository()
const tabs = [{ title: 'Popis' }, { title: 'Přehled' }, { title: 'Čtení' }]
const activeTab = ref<number>(0)
const notification = useNotificationsStore()

definePageMeta({
  layout: 'sub-page',
  title: 'Detail knihy',
})

async function fetchBook() {
  if (book.value?.id === Number(route.params.id))
    return

  try {
    isLoading.value = true
    const response = await bookRepository.fetchBook(Number(route.params.id))
    booksStore.setCurrentBook(response)
  }
  catch {
    notification.error('Nepodařilo se načíst knihu')
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
  <main v-if="isLoading" class="flex-1 flex flex-col items-center justify-center">
    <p class="text-lg mb-4">
      Načítám detail knihy..
    </p>
    <div class="loader h-12 w-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
  </main>

  <main v-else-if="book" class="flex-1 overflow-auto">
    <section class="flex gap-3 p-3">
      <figure class="max-w-[30vw] aspect-ratio-2/3 rounded-lg overflow-hidden self-start">
        <img v-if="book.coverImage" class="w-full h-full object-fill" :src="book.coverImage" :alt="book.title">
        <div v-else class="w-full h-full bg-gray-300" />
      </figure>

      <div class="main-info__content">
        <h1 class="text-xl font-bold line-clamp-2">
          {{ book.title }}
        </h1>
        <p v-if="book.subtitle" class="text-sm text-gray-600 mt-1 line-clamp-2">
          {{ book.subtitle }}
        </p>
        <p v-if="book.authors.length > 0" class="text-[0.9375rem] mt-2 text-blue-700">
          <NuxtLink v-for="(author, index) in book.authors" :key="author.id" :to="`/author/${author.id}`">
            {{ author.fullName }}<span v-if="index < book.authors.length - 1">, </span>
          </NuxtLink>
        </p>

        <dl class="mt-3 space-y-1.5 text-sm text-gray-600">
          <div v-if="book.language" class="flex items-center gap-1.5">
            <dt aria-label="Jazyk">
              <div class="i-material-symbols:translate" />
            </dt>
            <dd class="mt-[3px]">
              {{ LANGUAGE_NAMES[book.language] }}
            </dd>
          </div>

          <div v-if="book.publicationYear" class="flex items-center gap-1.5">
            <dt aria-label="Rok vydání">
              <div class="i-material-symbols:calendar-today" />
            </dt>
            <dd class="mt-[3px]">
              {{ book.publicationYear }}
            </dd>
          </div>
        </dl>
      </div>
    </section>
    <section>
      <BookTabs
        v-model="activeTab"
        :tabs="tabs"
        :animation-duration="250"
        class="flex-grow overflow-hidden"
        :padding-inline="12"
      >
        <template #tab-0>
          <div class="p-3">
            {{ book.description }}
          </div>
        </template>
        <template #tab-1>
          <div class="p-3">
            Not implemented yet
          </div>
        </template>
        <template #tab-2>
          <div class="p-3">
            Not implemented yet
          </div>
        </template>
      </BookTabs>
    </section>
  </main>
</template>
