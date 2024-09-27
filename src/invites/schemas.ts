import { MemberPrivileges } from "db"
import { z } from "zod"

export const InviteFormSchema = z.object({
  invitationCode: z.string(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateInviteSchema = z.object({
  projectId: z.number(),
  privilege: z.nativeEnum(MemberPrivileges),
  addedBy: z.string(),
  email: z.string(),
  rolesId: z.array(z.number()).optional().nullable(),

  // template: __fieldName__: z.__zodType__(),
})

export const DeleteInviteSchema = z.object({
  id: z.number(),
})

export const AcceptInviteSchema = z.object({
  id: z.number(),
  userId: z.number(),
})
