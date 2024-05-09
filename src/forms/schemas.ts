import { Prisma } from "@prisma/client"
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.JsonValue
    }),
  uiSchema: z
    .unknown()
    .nullable()
    .refine(
      (data) => {
        if (data === null || data === undefined) {
          return true
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.NullableJsonNullValueInput
    }),
  userId: z.number(),
})

export const EditFormSchema = z.object({
  id: z.number(),
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.JsonValue
    }),
  uiSchema: z
    .unknown()
    .nullable()
    .refine(
      (data) => {
        if (data === null || data === undefined) {
          return true
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.NullableJsonNullValueInput
    }),
})
