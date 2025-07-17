import { z } from "zod"
import { defaultRoleTemplates } from "./templates/defaultRoles"

export const CreateRoleSchema = z.object({
  userId: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  taxonomy: z.string().optional().nullable(),
})
export const UpdateRoleSchema = CreateRoleSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteRoleSchema = z.object({
  id: z.number(),
})

export const RoleFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  taxonomy: z.string().optional(),
  // template: __fieldName__: z.__zodType__(),
})

export const RoleIdsFormSchema = z.object({
  rolesId: z.array(z.number()).optional().nullable(),
})

export const ImportRolesSchema = z.object({
  system: z.array(z.enum(defaultRoleTemplates.map((r) => r.id) as [string, ...string[]])),
  userId: z.number(),
})
