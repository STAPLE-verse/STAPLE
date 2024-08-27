import { z } from "zod"

export const FormProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  abstract: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  citation: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  identifier: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  abstract: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  citation: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  identifier: z.string().optional().nullable(),
  columns: z.any(),
  // template: __fieldName__: z.__zodType__(),
})

export const UpdateProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  abstract: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  citation: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  identifier: z.string().optional().nullable(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteProjectSchema = z.object({
  id: z.number(),
})

export const UpdateProjectLabelSchema = z.object({
  projectsId: z.array(z.number()).nonempty(),
  labelsId: z.array(z.number()).optional().nullable(),
  disconnect: z.boolean(),
})

export const FormAnnouncementSchema = z.object({
  projectId: z.number(),
  announcementText: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
