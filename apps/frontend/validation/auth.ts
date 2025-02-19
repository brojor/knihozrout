import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email je povinný')
    .email('Neplatný formát emailu'),
  password: z.string()
    .min(1, 'Heslo je povinné')
    .min(8, 'Heslo musí mít alespoň 8 znaků'),
})

export const registerSchema = loginSchema.extend({
  fullName: z.string()
    .min(1, 'Jméno je povinné')
    .max(30, 'Jméno je příliš dlouhé'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
