// plugins/handle-shared-text.ts
export default defineNuxtPlugin(() => {
  const router = useRouter()

  window.handleSharedText = (sharedText: string) => {
    router.push({
      path: '/bookFromUrl',
      query: { url: sharedText },
    })
  }
})
