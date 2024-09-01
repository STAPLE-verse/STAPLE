import { z } from "zod"

export const FormElementSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateElementSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateElementSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteElementSchema = z.object({
  id: z.number(),
})
