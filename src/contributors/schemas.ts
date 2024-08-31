import { ContributorPrivileges } from "@prisma/client"
import { z } from "zod"

export const CreateContributorSchema = z.object({
  invitationCode: z.string(),
  userId: z.number(),
})

export const CreateContributorFormSchema = z.object({
  email: z.string(),
  privilege: z.nativeEnum(ContributorPrivileges),
  labelsId: z.array(z.number()).optional().nullable(),
})

export const UpdateContributorFormSchema = z.object({
  privilege: z.nativeEnum(ContributorPrivileges),
})

export const UpdateContributorSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
  labelsId: z.array(z.number()).optional().nullable(),
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
