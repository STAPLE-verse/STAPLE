import { z } from "zod"

export const FormTaskSchema = z.object({
  name: z.string(),
  columnId: z.number(),
  description: z.string().optional(),
  elementId: z.number().optional(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateTaskSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  columnId: z.number(),
  description: z.string().optional(),
  elementId: z.number().optional(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  columnId: z.number(),
  elementId: z.number().optional(),
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
