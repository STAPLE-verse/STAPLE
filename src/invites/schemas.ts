import { ContributorPrivileges } from "db"
import { z } from "zod"

export const InviteFormSchema = z.object({
  invitationCode: z.string(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateInviteSchema = z.object({
  projectId: z.number(),
  privilege: z.nativeEnum(ContributorPrivileges),
  addedBy: z.string(),
  email: z.string(),
  labelsId: z.array(z.number()).optional().nullable(),

  // template: __fieldName__: z.__zodType__(),
})
