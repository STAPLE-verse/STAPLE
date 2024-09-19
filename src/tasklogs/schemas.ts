import { Status, CompletedAs, Prisma } from "@prisma/client"
import { z } from "zod"

export const CreateTaskLogSchema = z.object({
  id: z.number(),
  // For the new assignmentStatusLog
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
  status: z.nativeEnum(Status),
  completedById: z.number(),
  completedAs: z.nativeEnum(CompletedAs).optional(),
})
