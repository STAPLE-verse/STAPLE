import { z } from "zod"

export const TeamFormSchema = z.object({
  name: z.string(),
  projectMemberUserIds: z.array(z.any()).refine((arr) => arr.length > 0, {
    message: "Select at least one team member",
  }),
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

export const CreateTeamSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  userIds: z.array(z.number()),
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

export const UpdateTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  userIds: z.array(z.number()),
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

export const DeleteTeamSchema = z.object({
  id: z.number(),
})
