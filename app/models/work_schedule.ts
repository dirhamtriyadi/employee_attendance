import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WorkSchedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare checkInTime: string

  @column()
  declare checkOutTime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
