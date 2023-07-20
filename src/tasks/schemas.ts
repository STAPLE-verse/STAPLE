import { z } from "zod"

export const CreateTaskSchema = z.object({
  projectId: z.number(),
  name: z.string(),
  description: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateTaskSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  name: z.string(),
  description: z.string(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteTaskSchema = z.object({
  id: z.number(),
})
