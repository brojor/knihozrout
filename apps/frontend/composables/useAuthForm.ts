import type { LoginInput, RegisterInput } from '~/validation/auth'
import { z } from 'zod'
import { AUTH_TEXTS } from '~/constants/auth'
import { loginSchema, registerSchema } from '~/validation/auth'

export function useAuthForm() {
  const authStore = useAuthStore()
  const router = useRouter()
  const errors = ref<Record<string, string>>({})
  const generalError = ref<string>('')
  const isLogin = ref(true)
  const isLoading = ref(false)

  const form = reactive<RegisterInput>({
    email: '',
    password: '',
    fullName: '',
  })

  function handleBackendError(error: ApiError) {
    if (error.status === 400) {
      generalError.value = 'Nesprávné přihlašovací údaje'
      return
    }

    if (error.status === 422) {
      errors.value = error.errors!.reduce((acc, curr) => {
        acc[curr.field] = curr.message
        return acc
      }, {} as Record<string, string>)
    }
  }

  function handleZodError(e: z.ZodError<any>) {
    errors.value = e.errors.reduce((acc: Record<string, string>, curr) => {
      acc[curr.path[0]] = curr.message
      return acc
    }, {})
  }

  function clearErrors() {
    errors.value = {}
    generalError.value = ''
  }

  function toggleMode() {
    isLogin.value = !isLogin.value
    clearErrors()
  }

  async function handleSubmit() {
    clearErrors()
    isLoading.value = true

    try {
      const schema = isLogin.value ? loginSchema : registerSchema
      await schema.parseAsync(form)

      if (isLogin.value)
        await authStore.login(form as LoginInput)
      else
        await authStore.register(form as RegisterInput)

      await router.push('/')
    }
    catch (e) {
      if (e instanceof z.ZodError) {
        handleZodError(e)
      }
      else if (e instanceof ApiError) {
        handleBackendError(e)
      }
      else {
        throw e
      }
    }
    finally {
      isLoading.value = false
    }
  }

  const texts = computed(() => AUTH_TEXTS[isLogin.value ? 'login' : 'register'])

  return {
    form,
    isLogin,
    isLoading,
    errors,
    generalError,
    texts,
    toggleMode,
    handleSubmit,
    clearErrors,
  }
}
