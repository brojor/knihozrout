<script setup lang="ts">
const { $customFetch } = useNuxtApp()
const router = useRouter()
const token = useCookie('token')

const isLogin = ref(true)
const error = ref('')
const form = reactive({
  email: '',
  password: '',
  fullName: '',
})

async function handleSubmit() {
  try {
    error.value = ''
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register'
    const response = await $customFetch<{ token: { token: string } }>(endpoint, {
      method: 'POST',
      body: {
        ...form,
        fullName: isLogin.value ? undefined : form.fullName,
      },
    })

    token.value = response.token.token
    await router.push('/')
  }
  catch (e: any) {
    error.value = e.response?._data?.message || `Došlo k chybě při ${isLogin.value ? 'přihlášení' : 'registraci'}`
  }
}
</script>

<template>
  <div class="auth-container">
    <h1>{{ isLogin ? 'Přihlášení' : 'Registrace' }}</h1>

    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email:</label>
        <input v-model="form.email" type="email" required>
      </div>

      <div class="form-group">
        <label>Heslo:</label>
        <input v-model="form.password" type="password" required>
      </div>

      <div v-if="!isLogin" class="form-group">
        <label>Celé jméno:</label>
        <input v-model="form.fullName" type="text">
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <button type="submit">
        {{ isLogin ? 'Přihlásit' : 'Registrovat' }}
      </button>

      <p class="toggle-mode">
        {{ isLogin ? 'Nemáte účet?' : 'Již máte účet?' }}
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? 'Registrujte se' : 'Přihlaste se' }}
        </a>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 14px;
}

.toggle-mode {
  text-align: center;
  margin-top: 10px;
}
</style>
