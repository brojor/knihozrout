<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const {
  form,
  isLogin,
  isLoading,
  errors,
  generalError,
  texts,
  toggleMode,
  handleSubmit,
} = useAuthForm()
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

    <AuthForm
      v-model:form="form"
      :is-login="isLogin"
      :is-loading="isLoading"
      :errors="errors"
      :general-error="generalError"
      @submit="handleSubmit"
    />

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
