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
  semantics: z
    .unknown()
    .nullable()
    .optional()
    .refine(
      (data) => {
        if (data === null || data === undefined) return true
        try {
          JSON.parse(JSON.stringify(data))
          return true
        } catch {
          return false
        }
      },
      { message: "Invalid Semantic V1 JSON" }
    )
    .transform((data) => {
      if (data === null || data === undefined) return Prisma.JsonNull
      return data as Prisma.NullableJsonNullValueInput
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

export const AddFormTemplatesSchema = z.object({
  selectedFormIds: z.array(z.number()),
})

export const ArchiveFormSchema = z.object({
  formId: z.number(),
  archived: z.boolean(),
})

export const UpdateFormMetaSchema = z.object({
  id: z.number(),
  tags: z.array(z.string()).optional(),
  folderId: z.number().nullable().optional(),
})

export const CreateFolderSchema = z.object({
  name: z.string().min(1),
})

export const DeleteFolderSchema = z.object({
  id: z.number(),
})

export const RenameFolderSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})
