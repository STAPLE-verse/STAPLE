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

export const LabelFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  taxonomy: z.string().optional(),
  // template: __fieldName__: z.__zodType__(),
})

export const LabelTaskFormSchema = z.object({
  labelsId: z.array(z.number()).optional().nullable(),
})
