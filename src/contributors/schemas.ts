import { ContributorPrivileges } from "@prisma/client"
import { z } from "zod"

export const CreateContributorSchema = z.object({
  projectId: z.number(),
  userId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateContributorSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteContributorSchema = z.object({
  id: z.number(),
})
