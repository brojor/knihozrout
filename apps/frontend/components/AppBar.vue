<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const cameFromImportBookPage = computed(() => {
  return useNuxtApp().$lastRoute.value.name === 'bookFromUrl'
})

function backHandler() {
  cameFromImportBookPage.value
    ? router.push('/library')
    : router.back()
}

const title = computed(() => route.meta.title || 'Subpage')
</script>

<template>
  <header class="relative flex items-center h-12 px-4 border-b border-gray-200">
    <button @click="backHandler">
      <div class="i-material-symbols:arrow-back" />
    </button>

    <span class="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
      {{ title }}
    </span>
  </header>
</template>
