import { z } from "zod"

// Schemas of notifications
export const taskAssignedSchema = z.object({
  taskName: z.string(),
  createdBy: z.string(),
  deadline: z.date(),
})

// Map template names to their corresponding Zod schemas
export const templateToSchemaMap: Record<string, z.ZodSchema> = {
  taskAssigned: taskAssignedSchema,
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
