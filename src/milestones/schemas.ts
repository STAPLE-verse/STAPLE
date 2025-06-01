import { z } from "zod"

export const FormMilestoneSchema = z
  .object({
    name: z.string(),
    description: z.string().optional().nullable(),
    taskIds: z.number().array().optional(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
    tags: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional()
      .nullable(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date.",
    path: ["startDate"],
  })

export const CreateMilestoneSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  description: z.string().optional().nullable(),
  taskIds: z.number().array().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  tags: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateMilestoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  taskIds: z.number().array().optional(),
  tags: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateMilestoneDatesSchema = z.object({
  id: z.number(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export const DeleteMilestoneSchema = z.object({
  id: z.number(),
})
