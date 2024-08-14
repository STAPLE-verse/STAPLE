import { ContributorPrivileges } from "@prisma/client"
import { z } from "zod"

export const CreateContributorSchema = z.object({
  projectId: z.number(),
  userId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
  addedBy: z.string(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateContributorFormSchema = z.object({
  userId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
})

export const UpdateContributorFormSchema = z.object({
  privilege: z.nativeEnum(ContributorPrivileges),
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

export const UpdateContributorLabelSchema = z.object({
  contributorsId: z.array(z.number()).nonempty(),
  labelsId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})
