<script setup lang="ts">
import { AUTH_TEXTS } from '~/constants/auth'

const props = defineProps<{
  isLogin: boolean
  isLoading: boolean
  errors: Record<string, string>
  form: {
    fullName: string
    email: string
    password: string
  }
  generalError?: string
}>()

const emit = defineEmits<{
  'submit': []
  'update:form': [form: typeof props.form]
}>()

// Vytvoříme lokální reaktivní kopii formuláře
const localForm = computed({
  get: () => props.form,
  set: newValue => emit('update:form', newValue),
})

const { inputs } = AUTH_TEXTS
const texts = computed(() => {
  return props.isLogin ? AUTH_TEXTS.login : AUTH_TEXTS.register
})
</script>

<template>
  <form
    class="space-y-6 mt-12"
    :aria-label="texts.formLabel"
    @submit.prevent="$emit('submit')"
  >
    <div
      v-if="generalError"
      class="text-red-700 text-center font-semibold text-sm"
      role="alert"
    >
      <div class="i-clarity:warning-solid mb-[2px]" />
      {{ generalError }}
      <div class="i-clarity:warning-solid mb-[2px]" />
    </div>

    <div class="space-y-4">
      <AuthInput
        v-if="!isLogin"
        id="fullName"
        v-model="localForm.fullName"
        :label="inputs.fullName"
        :error="errors.fullName"
        autocomplete="name"
      />

      <AuthInput
        id="email"
        v-model="localForm.email"
        type="email"
        :label="inputs.email"
        :error="errors.email"
        autocomplete="email"
      />

      <AuthInput
        id="password"
        v-model="localForm.password"
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
      <template v-if="isLoading">
        <div class="i-svg-spinners:180-ring mr-2" />
        {{ texts.loading }}
      </template>
      <template v-else>
        {{ texts.submitButton }}
      </template>
    </button>
  </form>
</template>
