<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const showPassword = ref(false)
const error = ref('')
const form = reactive({
  email: '',
  password: '',
  fullName: '',
})

function toggleMode() {
  isLogin.value = !isLogin.value
}

async function handleSubmit() {
  try {
    if (isLogin.value) {
      await authStore.login(form)
    }
    else {
      await authStore.register(form)
    }
    await router.push('/')
  }
  catch (e: any) {
    error.value = e.response?._data?.message || `Došlo k chybě při ${isLogin.value ? 'přihlášení' : 'registraci'}`
  }
}
</script>

<template>
  <main class="min-h-[100dvh] flex-1 bg-gradient-to-br from-[#F19A5E] to-[#EC6D59] text-white p-6 flex flex-col">
    <header class="space-y-4">
      <h1 class="text-4xl font-bold">
        {{ isLogin ? 'Vítej zpět,' : 'Vítej mezi námi,' }}
      </h1>
      <p class="text-xl font-400">
        {{ isLogin ? 'tvoje knihovna na tebe čeká' : 'založíme ti knihovnu' }}
      </p>
    </header>

    <form class="space-y-6 mt-12" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Full name field -->
        <div v-if="!isLogin">
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Jméno a příjmení"
            aria-label="Jméno a příjmení"
            class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full"
            required
            autocomplete="name"
          >
        </div>

        <!-- Email field -->
        <div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="E-mailová adresa"
            aria-label="E-mailová adresa"
            class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full"
            required
            autocomplete="email"
          >
        </div>

        <!-- Password field -->
        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            placeholder="Heslo"
            aria-label="Heslo"
            class="h-14 px-6 rounded-xl bg-white:30  placeholder-white w-full pr-14"
            required
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
          >
          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2"
            :aria-label="showPassword ? 'Skrytí hesla' : 'Zobrazení hesla'"
            @click="showPassword = !showPassword"
          >
            <div v-if="showPassword" class="i-clarity:eye-line" />
            <div v-else class="i-clarity:eye-hide-line" />
          </button>
        </div>

        <!-- Forgot password link -->
        <div v-if="isLogin" class="text-right">
          <a href="#" class="text-sm underline">
            Zapomněl/a jsi heslo?
          </a>
        </div>
      </div>

      <!-- Submit button  -->
      <button
        type="submit"
        class="w-full h-14 text-lg font-semibold rounded-xl bg-white text-gray-900 active:bg-gray-100"
      >
        {{ isLogin ? 'Přihlásit se' : 'Vytvořit účet' }}
      </button>
    </form>

    <div class="flex flex-1 justify-center items-center my-4">
      <img
        src="/images/robot.png"
        alt="Roztomilý robot"
        class="object-contain max-h-22vh"
      >
    </div>
    <footer class="text-center">
      <p class="text-white">
        {{ isLogin ? "Nemáš účet?" : 'Už máš účet?' }}
        <button
          class="font-semibold ml-1 underline"
          @click="toggleMode"
        >
          {{ isLogin ? 'Zaregistruj se' : 'Přihlaš se' }}
        </button>
      </p>
    </footer>
  </main>
</template>

<style>
header {
  margin-top: clamp(
    0px, calc((100vh - 667px) * (80 / (844 - 667))), 80px);
}
</style>
