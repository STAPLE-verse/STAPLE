import { Prisma, TaskStatus } from "@prisma/client"
import { z } from "zod"

export const CreateFormSchema = z.object({
  schema: z
    .unknown()
    .refine(
      (data) => {
        try {
          JSON.parse(JSON.stringify(data))
          return true
        } catch (error) {
          return false
        }
      },
      { message: "Invalid JSON format" }
    )
    .transform((data) => data as Prisma.JsonValue),
  uiSchema: z
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
  userId: z.number(),
  // template: __fieldName__: z.__zodType__(),
})
