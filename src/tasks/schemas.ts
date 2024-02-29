import { Prisma, TaskStatus } from "@prisma/client"
import { z } from "zod"

export const FormTaskSchema = z.object({
  name: z.string(),
  columnId: z.number(),
  description: z.string().optional().nullable(),
  elementId: z.number().optional().nullable(),
  // TODO: Has to be modified to array if multiple select is enabled
  contributorsId: z.array(z.any()).optional().nullable(),
  deadline: z.date().optional().nullable(),
  teamsId: z.array(z.any()).optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
  schema: z
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
  files: z
    .unknown()
    .nullable()
    .optional()
    .refine(
      (value): value is File | null | undefined => {
        return value === null || value === undefined || value instanceof File
      },
      { message: "File input required for files field" }
    ),
})

export const CreateTaskSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  columnId: z.number(),
  description: z.string().optional().nullable(),
  elementId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
  createdById: z.number(),
  contributorsId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.number()).optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
  schema: z
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
})

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  columnId: z.number(),
  elementId: z.number().optional().nullable(),
  contributorsId: z.array(z.any()).optional().nullable(),
  teamsId: z.array(z.any()).optional().nullable(),
  schema: z
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
})

export const UpdateTaskStatusSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(TaskStatus),
})

export const DeleteTaskSchema = z.object({
  id: z.number(),
})

export const UpdateTaskOrderSchema = z.object({
  activeId: z.any(),
  overId: z.any(),
  activeIndex: z.any(),
  overIndex: z.any(),
})
