import { TaskStatus } from "@prisma/client"
import { z } from "zod"

export const FormTaskSchema = z.object({
  name: z.string(),
  columnId: z.number(),
  description: z.string().optional().nullable(),
  elementId: z.number().optional().nullable(),
  contributorsId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.number()).optional().nullable(),
  deadline: z.date().optional().nullable(),
  formVersionId: z.number().optional().nullable(),
})

export const CreateTaskSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  columnId: z.number(),
  formVersionId: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  elementId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
  createdById: z.number(),
  contributorsId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.number()).optional().nullable(),
})

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  columnId: z.number(),
  elementId: z.number().optional().nullable(),
  contributorsId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.any()).optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
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

export const UpdateTasksForElementSchema = z.object({
  elementId: z.number(),
  taskIds: z.array(z.number()),
})

export const UpdateTasksForElementFormSchema = z.object({
  selectedTasks: z.array(z.number()),
})
