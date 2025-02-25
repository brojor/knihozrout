<script setup lang="ts">
interface Props {
  book: Book
}

type Status = 'loading' | 'loaded' | 'error'
const props = defineProps<Props>()
const imageRef = ref<HTMLImageElement | null>(null)
const status = ref<Status>('loading')

// Pokud nemáme URL, hned přejdeme do chybového stavu
if (props.book.coverImage === null) {
  status.value = 'error'
}

onMounted(() => {
  // Pokud nemáme URL, nic neděláme
  if (!props.book.coverImage)
    return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Začneme načítat obrázek, když je v dohledu
        const img = imageRef.value as HTMLImageElement
        img.src = props.book.coverImage as string

        // Event listenery pro načtení/chybu
        img.onload = () => {
          status.value = 'loaded'
        }

        img.onerror = () => {
          status.value = 'error'
        }

        // Přestat sledovat
        observer.unobserve(img)
      }
    })
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01,
  })

  observer.observe(imageRef.value as HTMLImageElement)
})
</script>

<template>
  <NuxtLink
    class="book-card w-full"
    :to="`/book/${book.id}`"
  >
    <div class="relative w-full aspect-2/3 rounded overflow-hidden bg-gray-100">
      <!-- Obrázek s referencí -->
      <img
        v-if="book.coverImage !== null"
        ref="imageRef"
        :alt="`Cover of ${book.title}`"
        class="w-full h-full object-cover"
        :class="{
          'opacity-0': status !== 'loaded',
          'opacity-100': status === 'loaded',
        }"
      >

      <!-- Loading placeholder -->
      <div
        v-if="status === 'loading'"
        class="absolute inset-0 bg-gray-200 animate-pulse"
      />

      <!-- Error placeholder -->
      <div
        v-if="status === 'error'"
        class="absolute inset-0 flex-center bg-gray-200 text-gray-500 flex flex-col justify-center items-center"
      >
        <div class="i-material-symbols:image-outline text-3xl" />
        <p class="text-sm">
          Kniha nemá obálku
        </p>
      </div>
    </div>

    <div class="mt-0.5">
      <h3 class="text-sm font-medium line-clamp-1 leading-tight">
        {{ book.title }}
      </h3>
      <p class="text-xs text-gray-500 line-clamp-1 mt-0.25">
        {{ book.authors.map(author => author.fullName).join(', ') }}
      </p>
    </div>
  </NuxtLink>
</template>
