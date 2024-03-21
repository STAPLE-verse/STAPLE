import { AssignmentStatus, CompletedAs, Prisma } from "@prisma/client"
import { z } from "zod"

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
  completedBy: z.number().nullable(),
  completedAs: z.nativeEnum(CompletedAs).optional(),
})
