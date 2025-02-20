<script setup lang="ts">
function scan() {
  console.log('scan')
}

function manual() {
  console.log('manual')
}

// console log viewport size
onMounted(() => {
  console.log('viewport size', window.innerWidth, window.innerHeight)
})
</script>

<template>
  <div class="flex-1 bg-amber-500:20 relative">
    <h1>Library</h1>
    <FloatingActionButton @scan="scan" @manual="manual" />
  </div>
</template>
