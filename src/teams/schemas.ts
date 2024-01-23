import { z } from "zod"

export const TeamFormSchema = z.object({
  name: z.string(),
  // projectId: z.number(),
  contributorsId: z.array(z.any()).nonempty(),
})

export const CreateTeamSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  contributorsId: z.array(z.number()).nonempty(),
})

export const UpdateTeamSchema = CreateTeamSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteTeamSchema = z.object({
  id: z.number(),
})
