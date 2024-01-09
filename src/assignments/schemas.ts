import { AssignmentStatus, Prisma } from "@prisma/client"
import { z } from "zod"

export const CreateAssignmentSchema = z.object({
  taskId: z.number(),
  contributorId: z.number(),
})

export const UpdateAssignmentSchema = z.object({
  id: z.number(),
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
  status: z.nativeEnum(AssignmentStatus),
})
