/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Autentizační endpointy
router
  .group(() => {
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/login', '#controllers/auth_controller.login')
    router.post('/logout', '#controllers/auth_controller.logout').use(middleware.auth())
  })
  .prefix('/auth')

// API endpointy
router
  .group(() => {
    router.post('/books/from-ean', '#controllers/books_controller.storeFromEan')
  })
  .prefix('/api')
  .use(middleware.auth())
