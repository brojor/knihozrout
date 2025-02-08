export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const publicPages = ['/login']

  if (!auth.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
