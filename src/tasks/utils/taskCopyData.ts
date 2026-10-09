// Copying tasks (a milestone's tasks, or a set of tasks for a new interview or dataset) always
// makes new tasks the same way: same details, form, roles, column and settings, back to "not
// completed", with nobody assigned and no logs, responses or comments, so a copy never carries
// someone else's progress or sends anyone a notification.

export const TASK_COPY_INCLUDE = { roles: { select: { id: true } } } as const

type CopiedTask = {
  name: string
  description: string | null
  deadline: Date | null
  startDate: Date | null
  tags: unknown
  containerId: number
  formVersionId: number | null
  elementId: number | null
  autoAssignNew: any
  anonymous: boolean
  anonymousResponses: boolean
  roles: Array<{ id: number }>
}

export const taskCopyData = (
  task: CopiedTask,
  where: {
    name?: string
    projectId: number
    milestoneId: number | null
    containerTaskOrder: number
    createdById: number
  }
) => ({
  name: where.name ?? task.name,
  description: task.description,
  deadline: task.deadline ?? undefined,
  startDate: task.startDate ?? undefined,
  tags: (task.tags ?? undefined) as any,
  containerTaskOrder: where.containerTaskOrder,
  containerId: task.containerId,
  projectId: where.projectId,
  milestoneId: where.milestoneId ?? undefined,
  formVersionId: task.formVersionId ?? undefined,
  elementId: task.elementId ?? undefined,
  status: "NOT_COMPLETED" as const,
  autoAssignNew: task.autoAssignNew,
  anonymous: task.anonymous,
  anonymousResponses: task.anonymousResponses,
  createdById: where.createdById,
  roles:
    task.roles.length > 0 ? { connect: task.roles.map((role) => ({ id: role.id })) } : undefined,
})
