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
  <div class="container">
    <h1>Vítejte v aplikaci Knihozrout</h1>
    <button class="logout-btn" @click="handleLogout">
      Odhlásit se
    </button>
    <button @click="router.push('/scanBarcode')">
      Skenovat knihu
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

.logout-btn {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
