import { Status, AutoAssignNew } from "@prisma/client"
import { z } from "zod"

export const FormTaskSchema = z
  .object({
    name: z.string(),
    containerId: z.number(),
    description: z.string().optional().nullable(),
    milestoneId: z.number().optional().nullable(),
    projectMembersId: z.array(z.number()).optional().nullable(),
    teamsId: z.array(z.number()).optional().nullable(),
    rolesId: z.array(z.number()).optional().nullable(),
    deadline: z.date().optional().nullable(),
    formVersionId: z.number().optional().nullable(),
    startDate: z.date().optional().nullable(),
    autoAssignNew: z.nativeEnum(AutoAssignNew).optional().nullable(),
    anonymous: z.boolean(),
    anonymousResponses: z.boolean(),
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
  milestoneId: z.number().optional().nullable(),
  startDate: z.date().optional().nullable(),
  deadline: z.date().optional().nullable(),
  createdById: z.number(),
  projectMembersId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.number()).optional().nullable(),
  rolesId: z.array(z.number()).optional().nullable(),
  autoAssignNew: z.nativeEnum(AutoAssignNew).optional().nullable(),
  anonymous: z.boolean(),
  anonymousResponses: z.boolean(),
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

export const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  containerId: z.number(),
  milestoneId: z.number().optional().nullable(),
  projectMembersId: z.array(z.number()).optional().nullable(),
  teamsId: z.array(z.any()).optional().nullable(),
  formVersionId: z.number().optional().nullable(),
  deadline: z.date().optional().nullable(),
  rolesId: z.array(z.number()).optional().nullable(),
  startDate: z.date().optional().nullable(),
  autoAssignNew: z.nativeEnum(AutoAssignNew).optional().nullable(),
  anonymous: z.boolean(),
  anonymousResponses: z.boolean(),
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

export const UpdateTaskStatusSchema = z.object({
  id: z.number().int().positive(),
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

export const UpdateTasksForMilestoneSchema = z.object({
  milestoneId: z.number(),
  taskIds: z.array(z.number()),
})

export const UpdateTasksForMilestoneFormSchema = z.object({
  selectedTasks: z.array(z.number()),
})

export const DeleteColumnSchema = z.object({
  id: z.number(),
})

export const UpdateColumnSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})

export const UpdateTaskDatesSchema = z.object({
  id: z.number(),
  startDate: z.date().optional(),
  deadline: z.date().optional(),
})

export const CopyTaskSetSchema = z
  .object({
    projectId: z.number(),
    // the tasks that make up the set (for example steps 1 to 4 of a pipeline)
    taskIds: z.array(z.number()).min(1).max(100),
    // one full copy of the set is made for each label (for example "Interview 2")
    labels: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
    // put each copy of the set in its own new milestone, named after the label
    ownMilestones: z.boolean().optional(),
  })
  .refine((input) => input.taskIds.length * input.labels.length <= 500, {
    message: "That would create more than 500 tasks at once.",
  })
