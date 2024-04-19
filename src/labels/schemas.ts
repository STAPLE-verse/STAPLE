import { z } from "zod"

export const CreateLabelSchema = z.object({
  userId: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  taxonomy: z.string().optional().nullable(),
})
export const UpdateLabelSchema = CreateLabelSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteLabelSchema = z.object({
  id: z.number(),
})
