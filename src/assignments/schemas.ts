import { z } from "zod"

export const UpdateAssignmentSchema = z.object({
  id: z.number(),
})
