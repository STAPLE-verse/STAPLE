import { z } from "zod"

export const NoteVisibilityEnum = z.enum(["PRIVATE", "SHARED"])

export const CreateNoteInput = z.object({
  projectId: z.number().int().positive(),
  title: z.string().max(200).optional(),
  contentMarkdown: z.string().optional(),
  contentJSON: z.any().optional(),
  visibility: NoteVisibilityEnum.default("PRIVATE"),
  pinned: z.boolean().optional(),
})

export const UpdateNoteInput = z.object({
  id: z.number().int().positive(),
  title: z.string().max(200).optional(),
  contentMarkdown: z.string().optional(),
  contentJSON: z.any().optional(),
  visibility: NoteVisibilityEnum.optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
})

export const ListNotesInput = z.object({
  projectId: z.number().int().positive(),
  includeArchived: z.boolean().optional(),
})

export type CreateNoteInputType = z.infer<typeof CreateNoteInput>
export type UpdateNoteInputType = z.infer<typeof UpdateNoteInput>
export type ListNotesInputType = z.infer<typeof ListNotesInput>
