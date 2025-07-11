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
    // Get the latest log per task assigned to this person
    const latestLogsForPersonMap = new Map<number, TaskLog>()
    for (const task of person.assignedTasks) {
      for (const log of task.taskLogs) {
        if (log.assignedToId !== person.id) continue
        const existing = latestLogsForPersonMap.get(log.taskId)
        if (!existing || existing.createdAt < log.createdAt) {
          latestLogsForPersonMap.set(log.taskId, log)
        }
      }
    }
    const latestLogsForPerson = Array.from(latestLogsForPersonMap.values())

    const total = latestLogsForPerson.length
    const complete = latestLogsForPerson.filter((log) => log.status === Status.COMPLETED).length
    const approved = latestLogsForPerson.filter((log) => log.approved === true).length

    const withForm = person.assignedTasks.filter((task) => task.formVersionId)
    const formComplete = withForm.filter((task) => {
      const latest = latestLogsForPerson.find((log) => log.taskId === task.id)
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
      percentTasksComplete: total ? Math.round((complete / total) * 100) : null,
      percentApproved: total ? Math.round((approved / total) * 100) : null,
      percentFormsComplete: withForm.length
        ? Math.round((formComplete / withForm.length) * 100)
        : null,
      formAssignedCount: withForm.length,
      roles: uniqueRoles,
      type: person.users.length > 1 ? "Team" : "Individual",
      userId: person.id,
      projectId: projectId,
    }
  })
}
