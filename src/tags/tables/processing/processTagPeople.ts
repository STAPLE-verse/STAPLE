import { ProjectMemberWithUsers } from "src/core/types"
import { TagPeopleData } from "../columns/TagPeopleColumns"
import { Role, Status, Task, TaskLog } from "db"

export type PeopleWithTasksRoles = ProjectMemberWithUsers & {
  assignedTasks: (Task & {
    taskLogs: TaskLog[]
    roles: Role[]
  })[]
  roles: Role[]
}

export function processTagPeople(
  people: PeopleWithTasksRoles[],
  projectId: number
): TagPeopleData[] {
  return people.map((person) => {
    const allLogs: TaskLog[] = person.assignedTasks.flatMap((task) => task.taskLogs)

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

    const withForm = person.assignedTasks.filter((task) => task.formVersionId)
    const formComplete = withForm.filter((task) => {
      const latest = latestLogArray.find((log) => log.taskId === task.id)
      return latest?.status === Status.COMPLETED
    }).length

    const roleLabelCounts: Record<string, number> = {}
    person.assignedTasks.forEach((task) => {
      task.roles?.forEach((role) => {
        if (role.name) {
          roleLabelCounts[role.name] = (roleLabelCounts[role.name] || 0) + 1
        }
      })
    })

    const taskRoleNames = person.assignedTasks.flatMap(
      (task) => task.roles?.map((r) => r.name).filter(Boolean) ?? []
    )
    const directRoleNames = person.roles?.map((r) => r.name).filter(Boolean) ?? []
    const uniqueRoles = Array.from(new Set([...taskRoleNames, ...directRoleNames]))

    let name
    if (person.name) {
      name = person.name
    } else {
      name =
        person?.users?.[0]?.firstName && person?.users?.[0]?.lastName
          ? `${person.users[0].firstName} ${person.users[0].lastName}`
          : person?.users?.[0]?.username || "Unknown User"
    }

    return {
      name,
      createdAt: person.createdAt ?? null,
      percentTasksComplete: total ? Math.round((complete / total) * 100) : 0,
      percentApproved: total ? Math.round((approved / total) * 100) : 0,
      percentFormsComplete: withForm.length
        ? Math.round((formComplete / withForm.length) * 100)
        : 0,
      roles: uniqueRoles,
      type: person.users.length > 1 ? "Team" : "Individual",
      userId: person.id,
      projectId: projectId,
    }
  })
}
