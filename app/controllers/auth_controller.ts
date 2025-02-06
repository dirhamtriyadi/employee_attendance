import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  // Register
  async register({ request, response }: HttpContext) {
    // Menampung input dari body untuk validasi
    const credentials = request.only(['full_name', 'email', 'password', 'password_confirmation'])
    // Validasi email dan password
    const validatedData = await registerValidator.validate(credentials)

    const user = await User.create(validatedData)

    return response.created(user)
  }

  // Login
  async login({ request, response }: HttpContext) {
    // Menampung input dari body untuk validasi
    const credentials = request.only(['email', 'password'])
    // Validasi email dan password
    const validatedData = await loginValidator.validate(credentials)

    // Cek apakah email tersedia pada database
    const user = await User.findBy('email', validatedData.email)
    if (!user) {
      return response.abort('Invalid credentials')
    }

    // Cek apakah password dari input body === user password
    const isPasswordValid = await hash.verify(user.password, credentials.password)
    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: user,
      token: token,
    })
  }
}
