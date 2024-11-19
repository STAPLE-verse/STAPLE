import { z } from "zod"

export const TeamFormSchema = z.object({
  name: z.string(),
  projectMemberUserIds: z.array(z.any()).refine((arr) => arr.length > 0, {
    message: "Select at least one team member",
  }),
})

export const CreateTeamSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  userIds: z.array(z.number()),
})

export const UpdateTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  userIds: z.array(z.number()),
})

export const DeleteTeamSchema = z.object({
  id: z.number(),
})
