<script setup lang="ts">
import { z } from 'zod'
import { loginSchema, registerSchema } from '~/validation/auth'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const showPassword = ref(false)
const isLoading = ref(false)
const form = reactive({
  email: '',
  password: '',
  fullName: '',
})

const { errors, handleBackendError, clearErrors } = useAuthForm()

function toggleMode() {
  isLogin.value = !isLogin.value
}

async function handleSubmit() {
  clearErrors()
  isLoading.value = true

  try {
    const schema = isLogin.value ? loginSchema : registerSchema
    await schema.parseAsync(form)

    if (isLogin.value) {
      await authStore.login(form)
    }
    else {
      await authStore.register(form)
    }
    await router.push('/')
  }
  catch (e) {
    if (e instanceof z.ZodError) {
      // Zod validační chyby
      errors.value = e.errors.reduce((acc: Record<string, string>, curr) => {
        acc[curr.path[0]] = curr.message
        return acc
      }, {})
    }
    else {
      // Backend chyby
      handleBackendError(e)
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-[100dvh] flex-1 bg-gradient-to-br from-[#F19A5E] to-[#EC6D59] text-white p-6 flex flex-col">
    <header class="space-y-4">
      <h1 id="page-title" class="text-4xl font-bold">
        {{ isLogin ? 'Vítej zpět,' : 'Vítej mezi námi,' }}
      </h1>
      <p class="text-xl font-400">
        {{ isLogin ? 'tvoje knihovna na tebe čeká' : 'založíme ti knihovnu' }}
      </p>
    </header>

    <form
      class="space-y-6 mt-12"
      :aria-label=" isLogin ? 'Přihlášení' : 'Registrace' "
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-4">
        <!-- Full name field -->
        <div v-if="!isLogin" class="form-group">
          <label id="fullName-label" for="fullName" class="block mb-2 sr-only">
            Jméno a příjmení
          </label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            name="fullName"
            placeholder="Jméno a příjmení"
            class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full"
            :class="{ 'ring-1 ring-red-700': errors.fullName }"
            required
            autocomplete="name"
            aria-describedby="fullName-label"
            :aria-invalid="!!errors.fullName"
            :aria-errormessage="errors.fullName ? 'fullName-error' : undefined"
          >
          <div
            v-if="errors.fullName"
            id="fullName-error"
            class="text-red-700 text-sm mt-1"
            role="alert"
          >
            {{ errors.fullName }}
          </div>
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label id="email-label" for="email" class="block mb-2 sr-only">
            E-mailová adresa
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            name="email"
            placeholder="E-mailová adresa"
            class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full"
            :class="{ 'ring-1 ring-red-700': errors.email }"
            required
            autocomplete="email"
            aria-describedby="email-label"
            :aria-invalid="!!errors.email"
            :aria-errormessage="errors.email ? 'email-error' : undefined"
          >
          <div
            v-if="errors.email"
            id="email-error"
            class="text-red-700 text-sm mt-1"
            role="alert"
          >
            {{ errors.email }}
          </div>
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label id="password-label" for="password" class="block mb-2 sr-only">
            Heslo
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="Heslo"
              class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full pr-14"
              :class="{ 'ring-1 ring-red-700': errors.password }"
              required
              :autocomplete="isLogin ? 'current-password' : 'new-password'"
              aria-describedby="password-label"
              :aria-invalid="!!errors.password"
              :aria-errormessage="errors.password ? 'password-error' : undefined"
            >
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2"
              :aria-label="showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <div v-if="showPassword" class="i-clarity:eye-line" aria-hidden="true" />
              <div v-else class="i-clarity:eye-hide-line" aria-hidden="true" />
            </button>
          </div>
          <div
            v-if="errors.password"
            id="password-error"
            class="text-red-700 text-sm mt-1"
            role="alert"
          >
            {{ errors.password }}
          </div>
        </div>

        <!-- Forgot password link -->
        <div v-if="isLogin" class="text-right">
          <a
            href="#"
            class="text-sm underline"
            aria-label="Obnovit zapomenuté heslo"
          >
            Zapomněl/a jsi heslo?
          </a>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full h-14 text-lg font-semibold rounded-xl bg-white text-gray-900 active:bg-gray-100"
        :aria-busy="isLoading"
      >
        {{ isLogin ? 'Přihlásit se' : 'Vytvořit účet' }}
      </button>
    </form>

    <div class="flex flex-1 justify-center items-center my-4">
      <img
        src="/images/robot.png"
        alt="Roztomilý robot"
        class="object-contain max-h-22vh"
        role="presentation"
      >
    </div>

    <footer class="text-center">
      <p class="text-white">
        {{ isLogin ? "Nemáš účet?" : 'Už máš účet?' }}
        <button
          class="font-semibold ml-1 underline"
          type="button"
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
