import { z } from "zod"

export const CreateContributorSchema = z.object({
  projectId: z.number(),
  // id: z.number(),
  userId: z.number(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateContributorSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteContributorSchema = z.object({
  id: z.number(),
})
