import { Prisma, TaskStatus } from "@prisma/client"
import { z } from "zod"

export const FormTaskSchema = z
  .object({
    name: z.string(),
    columnId: z.number(),
    description: z.string().optional().nullable(),
    elementId: z.number().optional().nullable(),
    contributorsId: z.array(z.number()).optional().nullable(),
    teamsId: z.array(z.number()).optional().nullable(),
    deadline: z.date().optional().nullable(),
    // template: __fieldName__: z.__zodType__(),
    // schema: z
    //   .unknown()
    //   .nullable()
    //   .refine(
    //     (data) => {
    //       if (data === null || data === undefined) {
    //         return true // Allow null or undefined
    //       }

    //       try {
    //         JSON.parse(JSON.stringify(data))
    //         return true
    //       } catch (error) {
    //         return false
    //       }
    //     },
    //     { message: "Invalid JSON format" }
    //   )
    //   .transform((data) => data as Prisma.NullableJsonNullValueInput),
    // ui: z
    //   .unknown()
    //   .nullable()
    //   .refine(
    //     (data) => {
    //       if (data === null || data === undefined) {
    //         return true // Allow null or undefined
    //       }

    //       try {
    //         JSON.parse(JSON.stringify(data))
    //         return true
    //       } catch (error) {
    //         return false
    //       }
    //     },
    //     { message: "Invalid JSON format" }
    //   )
    //   .transform((data) => data as Prisma.NullableJsonNullValueInput),
    schema: z
      .object({
        name: z.string().nullable(), // name is nullable, but present in the object structure
        schema: z
          .unknown()
          .nullable()
          .refine(
            (data) => {
              if (data === null) {
                return true // Allow null
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
          .transform((data) => data as Prisma.JsonValue | null),
        ui: z
          .unknown()
          .nullable()
          .refine(
            (data) => {
              if (data === null) {
                return true // Allow null
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
          .transform((data) => data as Prisma.JsonValue | null),
      })
      .optional()
      .nullable(),
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
  .refine(
    (data) => {
      // Safely access the length or use 0 if contributorsId is null or undefined
      const hasContributors = (data.contributorsId?.length ?? 0) > 0
      const hasTeams = (data.teamsId?.length ?? 0) > 0
      return hasContributors || hasTeams
    },
    {
      message: "At least one contributor or team should be selected.",
      path: ["contributorsId"],
    }
  )

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
  ui: z
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.JsonNullValueInput
    }),
})

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  columnId: z.number(),
  elementId: z.number().optional().nullable(),
  contributorsId: z.array(z.number()).optional().nullable(),
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
  ui: z
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
    .transform((data) => {
      if (data === null) return Prisma.JsonNull
      else return data as Prisma.JsonNullValueInput
    }),
})

export const UpdateTaskStatusSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(TaskStatus),
})

export const DeleteTaskSchema = z.object({
  id: z.number(),
})

export const UpdateTaskOrderSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.number(),
      columnId: z.number(),
      columnTaskIndex: z.number(),
    })
  ),
})

// export const UpdateTaskLabelSchema = z.object({
//   taskId: z.number(),
//   labelsId: z.array(z.number()).optional().nullable(),
// })

export const UpdateTaskLabelSchema = z.object({
  tasksId: z.array(z.number()).nonempty(),
  labelsId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})

export const CreateColumnSchema = z.object({
  name: z.string(),
  projectId: z.number(),
})

export const UpdateColumnOrderSchema = z.object({
  columnIds: z.array(z.number()),
})
