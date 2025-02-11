<script setup lang="ts">
const router = useRouter()

onMounted(() => {
  window.handleSharedText = (sharedText: string) => {
    router.push({
      path: '/bookFromUrl',
      query: { url: sharedText },
    })
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
