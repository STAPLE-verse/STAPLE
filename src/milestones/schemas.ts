import { z } from "zod"

export const FormMilestoneSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateMilestoneSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateMilestoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteMilestoneSchema = z.object({
  id: z.number(),
})
