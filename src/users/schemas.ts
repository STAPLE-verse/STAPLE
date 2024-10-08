import { string, z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const FormProfileSchema = z.object({
  email,
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  institution: z.string().nullable(),
  username: z.string().min(3),
  language: z.string(),
})

export const UpdateUserSchema = z.object({
  email,
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  institution: z.string().nullable(),
  username: z.string().min(3),
  language: z.string(),
})
