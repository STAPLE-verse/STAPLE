import { z } from "zod"

export const UpdateUserSchema = z.object({
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
})
