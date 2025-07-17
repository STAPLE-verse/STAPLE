import { z } from "zod"

// Schemas of notifications
export const taskAssignedSchema = z.object({
  taskName: z.string(),
  createdBy: z.string(),
  deadline: z.date().optional(),
})

export const commentMadeSchema = z.object({
  taskName: z.string(),
  createdBy: z.string(),
  commentContent: z.string(),
})

export const addedToProjectSchema = z.object({
  projectName: z.string(),
  addedBy: z.string(),
  privilege: z.string(),
})

export const changedAssignmentSchema = z.object({
  taskName: z.string(),
  assignmentStatus: z.string(),
  completedBy: z.string(),
})

// Map template names to their corresponding Zod schemas
export const templateToSchemaMap: Record<string, z.ZodSchema> = {
  taskAssigned: taskAssignedSchema,
  addedToProject: addedToProjectSchema,
  changedAssignment: changedAssignmentSchema,
  commentMade: commentMadeSchema,
  // Add other mappings
}

// Dynamic schema resolver function
export const getDynamicSchema = (templateId: string): z.ZodSchema<any> => {
  const schema = templateToSchemaMap[templateId]
  if (!schema) {
    throw new Error(`No schema found for template: ${templateId}`)
  }
  return schema
}

export const DeleteNotificationSchema = z.object({
  id: z.number(),
})
