import { z } from "zod"

export const DeleteContributorSchema = z.object({
  id: z.number(),
})
