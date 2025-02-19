<script setup lang="ts">
interface Props {
  id: string
  modelValue: string
  type?: string
  name?: string
  label: string
  placeholder?: string
  autocomplete?: string
  error?: string
  isPasswordField?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  isPasswordField: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Pro pole typu heslo
const showPassword = ref(false)
const inputType = computed(() => {
  if (!props.isPasswordField)
    return props.type
  return showPassword.value ? 'text' : 'password'
})
</script>

<template>
  <div class="form-group">
    <label :id="`${id}-label`" :for="id" class="block mb-2 sr-only">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        :type="inputType"
        :name="name || id"
        :placeholder="placeholder || label"
        class="h-14 px-6 rounded-xl bg-white:30 placeholder-white w-full"
        :class="{ 'ring-1 ring-red-700': error, 'pr-14': isPasswordField }"
        required
        :autocomplete="autocomplete"
        :aria-describedby="`${id}-label`"
        :aria-invalid="!!error"
        :aria-errormessage="error ? `${id}-error` : undefined"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="isPasswordField"
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
      v-if="error"
      :id="`${id}-error`"
      class="text-red-700 text-sm mt-1 -mb-2"
      role="alert"
    >
      {{ error }}
    </div>
  </div>
</template>
