export default defineNuxtPlugin(() => {
  const router = useRouter()
  const lastRoute = ref(router.currentRoute.value)
  router.afterEach((_, from) => {
    lastRoute.value = from
  })
  return {
    provide: {
      lastRoute,
    },
  }
})
