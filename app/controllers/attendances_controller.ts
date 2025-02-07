import type { HttpContext } from '@adonisjs/core/http'
import Attendance from '#models/attendance'
import WorkSchedule from '#models/work_schedule'
import { DateTime } from 'luxon'

export default class AttendancesController {
  // Check In
  public async checkIn({ auth, response }: HttpContext) {
    try {
      // Pastikan user sudah login
      const user = auth.getUserOrFail()
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
      const today = DateTime.local({ zone: 'Asia/Jakarta' }).toISODate()
      console.log(today)

      // Cek apakah user sudah check-in hari ini
      const existingAttendance = await Attendance.query()
        .where('userId', user.id)
        .whereRaw('DATE(check_in_time) = ?', [today])
        .first()

      if (existingAttendance) {
        return response.badRequest({ message: 'You have already checked in today' })
      }

      // Mendapatkan jam kerja dari WorkSchedule
      const workSchedule = await WorkSchedule.first()

      if (!workSchedule) {
        return response.internalServerError({ message: 'Work schedule not set' })
      }

      // Mendapatkan waktu saat ini di zona Asia/Jakarta
      const currentTime = DateTime.local({ zone: 'Asia/Jakarta' }).toISOTime()
      const isLate = currentTime > workSchedule.checkInTime

      // Simpan data check-in
      const attendance = await Attendance.create({
        userId: user.id,
        checkInTime: DateTime.local({ zone: 'Asia/Jakarta' }).toISO(),
        isLate: isLate,
      })

      return response.ok({ message: 'Check-in successful', data: attendance })
    } catch (error) {
      return response.internalServerError({ message: 'Something went wrong', error })
    }
  }

  // Check Out
  public async checkOut({ auth, response }: HttpContext) {
    try {
      // Pastikan user sudah login
      const user = auth.getUserOrFail()
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      // Mendapatkan tanggal hari ini
      const today = DateTime.local({ zone: 'Asia/Jakarta' }).toFormat('yyyy-MM-dd')

      // Cari data absensi user hari ini
      const attendance = await Attendance.query()
        .where('userId', user.id)
        .whereRaw('DATE(check_in_time) = ?', [today])
        .first()

      if (!attendance) {
        return response.badRequest({ message: 'You have not checked in today' })
      }

      // Cek apakah user sudah check-out
      if (attendance.checkOutTime) {
        return response.badRequest({ message: 'You have already checked out' })
      }

      // Simpan waktu check-out
      attendance.checkOutTime = DateTime.local({ zone: 'Asia/Jakarta' }).toISO()
      await attendance.save()

      return response.ok({ message: 'Check-out successful', data: attendance })
    } catch (error) {
      return response.internalServerError({ message: 'Something went wrong', error })
    }
  }
}
