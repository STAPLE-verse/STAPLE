import { z } from "zod"

export const BreadcrumbLabelInput = z.union([
  z.object({
    type: z.enum(["project", "task", "milestone", "team", "form"]),
    id: z.number(),
  }),
  z.object({
    type: z.literal("contributor"),
    id: z.number(),
  }),
])

export type BreadcrumbLabelInputType = z.infer<typeof BreadcrumbLabelInput>
