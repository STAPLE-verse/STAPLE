import { z } from "zod"

export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  columns: z.any(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProjectSchema = z.object({
  id: z.number(),
})
