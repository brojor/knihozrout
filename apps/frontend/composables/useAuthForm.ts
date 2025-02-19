import { ref } from 'vue'

export function useAuthForm() {
  const errors = ref<Record<string, string>>({})

  function handleBackendError(error: any) {
    if (error.response?.status === 409) {
      errors.value.email = error.response._data.message
      return
    }

    const validationError = error.response?._data as ValidationError
    if (validationError.errors) {
      errors.value = validationError.errors.reduce((acc, curr) => {
        acc[curr.field] = curr.message
        return acc
      }, {} as Record<string, string>)
    }
  }

  function clearErrors() {
    errors.value = {}
  }

  return {
    errors,
    handleBackendError,
    clearErrors,
  }
}
