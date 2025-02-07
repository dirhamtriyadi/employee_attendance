import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'HR',
        email: 'hr@example.com',
        password: 'password',
      },
      {
        fullName: 'User',
        email: 'user@example.com',
        password: 'password',
      },
    ])
  }
}
