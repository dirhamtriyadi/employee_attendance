import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'HR',
        email: 'hr@example.com',
        role: 'superadmin',
        password: 'password',
      },
      {
        fullName: 'User',
        email: 'user@example.com',
        role: 'user',
        password: 'password',
      },
    ])
  }
}
