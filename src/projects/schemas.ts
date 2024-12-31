import { Prisma } from "db"
import { z } from "zod"

export const FormProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  columns: z.any(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  metadata: z
    .unknown()
    .nullable()
    .refine(
      (data) => {
        if (data === null || data === undefined) {
          return true // Allow null or undefined
        }

        try {
          JSON.parse(JSON.stringify(data))
          return true
        } catch (error) {
          return false
        }
      },
      { message: "Invalid JSON format" }
    )
    .transform((data) => data as Prisma.NullableJsonNullValueInput),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProjectSchema = z.object({
  id: z.number(),
})

export const UpdateProjectRoleSchema = z.object({
  projectsId: z.array(z.number()).nonempty(),
  rolesId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})

export const FormAnnouncementSchema = z.object({
  announcementText: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
