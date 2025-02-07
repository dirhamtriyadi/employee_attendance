import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table.foreign('user_id').references('users.id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('check_in_time')
      table.timestamp('check_out_time')
      table.boolean('is_late').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
