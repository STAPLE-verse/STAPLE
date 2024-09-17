import { MemberPrivileges } from "@prisma/client"
import { z } from "zod"

export const CreateProjectMemberSchema = z.object({
  invitationCode: z.string(),
  userId: z.number(),
})

export const CreateProjectMemberFormSchema = z.object({
  email: z.string(),
  privilege: z.nativeEnum(MemberPrivileges),
  rolesId: z.array(z.number()).optional().nullable(),
})

export const UpdateProjectMemberFormSchema = z.object({
  privilege: z.nativeEnum(MemberPrivileges),
})

export const UpdateProjectMemberSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  privilege: z.nativeEnum(MemberPrivileges),
  rolesId: z.array(z.number()).optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProjectMemberSchema = z.object({
  id: z.number(),
})

export const UpdateProjectMemberRoleSchema = z.object({
  projectMembersId: z.array(z.number()).nonempty(),
  rolesId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})
