import { z } from "zod"

export const TeamFormSchema = z.object({
  name: z.string(),
  // projectId: z.number(),
  projectMembersId: z.array(z.any()).nonempty(),
})

export const CreateTeamSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  projectMembers: z.array(z.number()),
})

export const UpdateTeamSchema = CreateTeamSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteTeamSchema = z.object({
  id: z.number(),
})
