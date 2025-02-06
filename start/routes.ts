/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

// Route default adonis
router
  .get('/', async () => {
    return {
      hello: 'world',
    }
  })
  .use(middleware.auth())

// Route group dengan prefix api
router
  .group(() => {
    // Route auth
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    // Route group dengan middleware auth
    router
      .group(() => {
        // Route check auth
        router.get('/me', async ({ auth, response }) => {
          try {
            const user = auth.getUserOrFail()
            return response.ok(user)
          } catch (error) {
            return response.unauthorized({ error: 'User not found' })
          }
        })
      })
      .use(middleware.auth())
  })
  .prefix('api')
