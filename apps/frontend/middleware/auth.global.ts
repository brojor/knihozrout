export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated && to.path !== '/auth') {
    return navigateTo('/auth')
  }

  if (isAuthenticated && to.path === '/auth') {
    return navigateTo('/')
  }
})
