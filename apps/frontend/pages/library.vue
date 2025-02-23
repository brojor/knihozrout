<script setup lang="ts">
const router = useRouter()
const notifications = useNotificationsStore()

function scan() {
  router.push('/scanBarcode')
}

function manual() {
  notifications.error('Manual entry not implemented', { duration: 10000 })
}
</script>

<template>
  <div class="flex-1 bg-amber-500:20 relative">
    <h1>Library</h1>
    <FloatingActionButton @scan="scan" @manual="manual" />
  </div>
</template>
