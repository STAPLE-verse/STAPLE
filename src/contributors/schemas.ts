import { z } from "zod"

export const CreateContributorSchema = z.object({
  projectId: z.undefined(),
  id: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateContributorSchema = z.object({
  id: z.number(),
  projectId: z.undefined(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteContributorSchema = z.object({
  id: z.number(),
})
