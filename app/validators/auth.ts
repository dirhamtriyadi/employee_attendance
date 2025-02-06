import vine from '@vinejs/vine'

// Validasi untuk register
export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string(),
    email: vine
      .string()
      .email()
      .maxLength(254)
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6).maxLength(32).confirmed(),
  })
)

// Validasi untuk login
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6).maxLength(32),
  })
)
