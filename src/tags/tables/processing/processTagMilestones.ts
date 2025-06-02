import { TagMilestoneData } from "../columns/TagMilestoneColumns"
import { Milestone, Role, Status, Task, TaskLog } from "db"

export type MilestoneWithTasksRoles = Milestone & {
  task: (Task & {
    taskLogs: TaskLog[]
    roles: Role[]
  })[]
}

export function processTagMilestones(milestones: MilestoneWithTasksRoles[]): TagMilestoneData[] {
  return milestones.map((milestone) => {
    const allLogs: TaskLog[] = milestone.task.flatMap((task) => task.taskLogs)

    // group by taskId + assignedToId and get the latest log per pair
    const latestLogs = new Map<string, TaskLog>()
    for (const log of allLogs) {
      const key = `${log.taskId}-${log.assignedToId}`
      if (!latestLogs.has(key) || latestLogs.get(key)!.createdAt < log.createdAt) {
        latestLogs.set(key, log)
      }
    }

    const latestLogArray = Array.from(latestLogs.values())

    const total = latestLogArray.length
    const complete = latestLogArray.filter((log) => log.status === Status.COMPLETED).length
    const approved = latestLogArray.filter((log) => log.approved === true).length

    const withForm = milestone.task.filter((task) => task.formVersionId)
    const formComplete = withForm.filter((task) => {
      const latest = latestLogArray.find((log) => log.taskId === task.id)
      return latest?.status === Status.COMPLETED
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
      startDate: milestone.startDate ?? null,
      endDate: milestone.endDate ?? null,
      percentTasksComplete: total ? Math.round((complete / total) * 100) : 0,
      percentApproved: total ? Math.round((approved / total) * 100) : 0,
      percentFormsComplete: withForm.length
        ? Math.round((formComplete / withForm.length) * 100)
        : 0,
      roles: uniqueRoles,
    }
  })
}
