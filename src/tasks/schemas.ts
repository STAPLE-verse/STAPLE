import { Status } from "@prisma/client"
import { z } from "zod"

export const FormTaskSchema = z
  .object({
    name: z.string(),
    containerId: z.number(),
    description: z.string().optional().nullable(),
    elementId: z.number().optional().nullable(),
    projectMembersId: z.array(z.number()).optional().nullable(),
    teamsId: z.array(z.number()).optional().nullable(),
    rolesId: z.array(z.number()).optional().nullable(),
    deadline: z.date().optional().nullable(),
    formVersionId: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      // Safely access the length or use 0 if projectMembersId is null or undefined
      const hasProjectMembers = (data.projectMembersId?.length ?? 0) > 0
      const hasTeams = (data.teamsId?.length ?? 0) > 0
      return hasProjectMembers || hasTeams
    },
    {
      message: "At least one contributor or team should be selected.",
      path: ["projectMembersId"],
    }
  )

export const CreateTaskSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  containerId: z.number(),
  formVersionId: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  elementId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
  createdById: z.number(),
  projectMembersId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.number()).optional().nullable(),
  rolesId: z.array(z.number()).optional().nullable(),
})

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  containerId: z.number(),
  elementId: z.number().optional().nullable(),
  projectMembersId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.any()).optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
  rolesId: z.array(z.number()).optional().nullable(),
})

export const UpdateStatusSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(Status),
})

export const DeleteTaskSchema = z.object({
  id: z.number(),
})

export const UpdateTaskOrderSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.number(),
      containerId: z.number(),
      containerTaskOrder: z.number(),
    })
  ),
})

export const UpdateTaskRoleSchema = z.object({
  tasksId: z.array(z.number()).nonempty(),
  rolesId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})

export const CreateColumnSchema = z.object({
  name: z.string(),
  projectId: z.number(),
})

export const UpdateColumnOrderSchema = z.object({
  containerIds: z.array(z.number()),
})

export const UpdateTasksForElementSchema = z.object({
  elementId: z.number(),
  taskIds: z.array(z.number()),
})

export const UpdateTasksForElementFormSchema = z.object({
  selectedTasks: z.array(z.number()),
})

export const DeleteColumnSchema = z.object({
  id: z.number(),
})

export const UpdateColumnSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})
