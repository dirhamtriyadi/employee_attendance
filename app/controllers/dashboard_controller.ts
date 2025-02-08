import WorkSchedule from '#models/work_schedule'
import Attendance from '#models/attendance'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
// import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ auth, response }: HttpContext) {
    // Pastikan user sudah login
    const user = auth.getUserOrFail()
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    // Pengecekan role pada user, jika admin maka akan melakukan query yang berbeda
    if (user.role === 'superadmin') {
      const users = await User.query().preload('attendances')

      return response.ok({ message: 'Data retrieved successfully.', data: users })
    }

    // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    // const today = DateTime.local({ zone: 'Asia/Jakarta' }).toISODate()

    // Ambil jam kerja
    const workSchedule = await WorkSchedule.first()
    // Cek apakah hari ini sudah check in dan check out
    const attendance = await Attendance.query().where('userId', user.id).first()

    response.ok({ work_schedule: workSchedule, attendance: attendance })
  }
}
