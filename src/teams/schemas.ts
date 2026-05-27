import { z } from "zod"

export const TeamFormSchema = z
  .object({
    name: z.string(),
    projectMemberUserIds: z.array(z.any()).optional().default([]),
    pendingInvitationIds: z.array(z.any()).optional().default([]),
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
  .refine(
    (data) =>
      (data.projectMemberUserIds?.length ?? 0) + (data.pendingInvitationIds?.length ?? 0) > 0,
    { message: "Select at least one team member" }
  )

export const CreateTeamSchema = z.object({
  name: z.string(),
  projectId: z.number(),
  userIds: z.array(z.number()),
  invitationIds: z.array(z.number()).optional().default([]),
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
  invitationIds: z.array(z.number()).optional().default([]),
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
