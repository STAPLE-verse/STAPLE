import { TagMilestoneData } from "../columns/TagMilestoneColumns"
import { Milestone, Role, Status, Task, TaskLog } from "db"

export type MilestoneWithTasksRoles = Milestone & {
  task: (Task & {
    taskLogs: TaskLog[]
    roles: Role[]
  })[]
}

export function processTagMilestones(
  milestones: MilestoneWithTasksRoles[],
  projectId: number
): TagMilestoneData[] {
  return milestones.map((milestone) => {
    // Get the latest log per task-user pair
    const latestLogMap = new Map<string, TaskLog>()
    for (const task of milestone.task) {
      for (const log of task.taskLogs) {
        const key = `${log.taskId}-${log.assignedToId}`
        const existing = latestLogMap.get(key)
        if (!existing || existing.createdAt < log.createdAt) {
          latestLogMap.set(key, log)
        }
      }
    }
    const latestLogArray = Array.from(latestLogMap.values())

    const total = latestLogArray.length
    const complete = latestLogArray.filter((log) => log.status === Status.COMPLETED).length
    const approved = latestLogArray.filter((log) => log.approved === true).length

    const withForm = milestone.task.filter((task) => task.formVersionId)

    const formComplete = withForm.filter((task) => {
      const matchingLogs = latestLogArray.filter((log) => log.taskId === task.id)
      return matchingLogs.some((log) => log.status === Status.COMPLETED)
    }).length

    const roleLabelCounts: Record<string, number> = {}
    milestone.task.forEach((task) => {
      task.roles?.forEach((role) => {
        if (role.name) {
          roleLabelCounts[role.name] = (roleLabelCounts[role.name] || 0) + 1
        }
      })
    })

    const uniqueRoles = Array.from(
      new Set(
        milestone.task.flatMap((task) => task.roles?.map((r) => r.name).filter(Boolean) ?? [])
      )
    )

    return {
      name: milestone.name,
      projectId: projectId,
      id: milestone.id,
      startDate: milestone.startDate ?? null,
      endDate: milestone.endDate ?? null,
      percentTasksComplete: total ? Math.round((complete / total) * 100) : 0,
      percentApproved: total ? Math.round((approved / total) * 100) : 0,
      percentFormsComplete: withForm.length
        ? Math.round((formComplete / withForm.length) * 100)
        : 0,
      formAssignedCount: withForm.length,
      roles: uniqueRoles,
    }
  })
}
