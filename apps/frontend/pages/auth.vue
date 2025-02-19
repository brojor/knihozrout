<script setup lang="ts">
import { AUTH_TEXTS } from '~/constants/auth'

definePageMeta({
  layout: 'auth',
})

const {
  form,
  isLogin,
  isLoading,
  errors,
  texts,
  toggleMode,
  handleSubmit,
} = useAuthForm()

const { inputs } = AUTH_TEXTS
</script>

<template>
  <main class="min-h-[100dvh] flex-1 bg-gradient-to-br from-[#F19A5E] to-[#EC6D59] text-white p-6 flex flex-col">
    <header class="space-y-4">
      <h1 id="page-title" class="text-4xl font-bold">
        {{ texts.title }}
      </h1>
      <p class="text-xl font-400">
        {{ texts.subtitle }}
      </p>
    </header>

    <form
      class="space-y-6 mt-12"
      :aria-label="texts.formLabel"
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-4">
        <AuthInput
          v-if="!isLogin"
          id="fullName"
          v-model="form.fullName"
          :label="inputs.fullName"
          :error="errors.fullName"
          autocomplete="name"
        />

        <AuthInput
          id="email"
          v-model="form.email"
          type="email"
          :label="inputs.email"
          :error="errors.email"
          autocomplete="email"
        />

        <AuthInput
          id="password"
          v-model="form.password"
          :label="inputs.password"
          :error="errors.password"
          :autocomplete="isLogin ? 'current-password' : 'new-password'"
          is-password-field
        />

        <!-- Forgot password link -->
        <div v-if="isLogin" class="text-right">
          <a
            href="#"
            class="text-sm underline"
            aria-label="Obnovit zapomenuté heslo"
          >
            {{ AUTH_TEXTS.forgotPassword }}
          </a>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full h-14 text-lg font-semibold rounded-xl bg-white text-gray-900 active:bg-gray-100"
        :class="{ 'opacity-75': isLoading }"
        :aria-busy="isLoading"
        :disabled="isLoading"
      >
        {{ texts.submitButton }}
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
        {{ texts.togglePrompt }}
        <button
          class="font-semibold ml-1 underline"
          type="button"
          @click="toggleMode"
        >
          {{ texts.toggleAction }}
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
