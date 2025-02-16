<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  }
  catch (e) {
    console.error('Chyba při odhlášení:', e)
  }
}
</script>

<template>
  <div class="bg-red-500:20 flex-1">
    <h1>Vítejte v aplikaci Knihozrout</h1>
    <button class="logout-btn" @click="handleLogout">
      Odhlásit se
    </button>
    <button @click="router.push('/scanBarcode')">
      Skenovat knihu
    </button>
  </div>
</template>
