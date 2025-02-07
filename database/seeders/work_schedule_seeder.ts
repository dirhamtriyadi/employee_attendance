import { BaseSeeder } from '@adonisjs/lucid/seeders'
import WorkSchedule from '#models/work_schedule'

export default class extends BaseSeeder {
  async run() {
    await WorkSchedule.createMany([
      {
        checkInTime: '08:00:00',
        checkOutTime: '17:00:00',
      },
    ])
  }
}
