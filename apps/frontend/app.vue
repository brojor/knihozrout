<script setup lang="ts">
onMounted(() => {
  window.handleSharedText = (sharedText: string) => {
    console.log('Sdílený obsah:', sharedText)
    alert(`Přijatý text: ${sharedText}`)
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
