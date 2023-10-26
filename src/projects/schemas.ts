import { z } from "zod"

export const FormProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  columns: z.any(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProjectSchema = z.object({
  id: z.number(),
})
