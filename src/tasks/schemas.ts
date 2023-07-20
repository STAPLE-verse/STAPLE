import { z } from "zod"

export const CreateTaskSchema = z.object({
  name: z.string(),
  projectId: z.any(),
  description: z.string().optional(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateTaskSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteTaskSchema = z.object({
  id: z.number(),
})
