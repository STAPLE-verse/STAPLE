import { TaskwithFormandLog } from "src/forms/components/ProjectFormsList"
import { Prisma, TaskLog } from "db"

export type ProjectFormData = {
  taskName: string
  formName: string
  taskId: number
  projectId: number
  formUi: Prisma.JsonValue
  formSchema: Prisma.JsonValue
  percentComplete: number
  percentApproved: number
}

export function processProjectForms(tasks: TaskwithFormandLog[]): ProjectFormData[] {
  return tasks.map((task) => {
    const logsByUser = new Map()
    task.taskLogs?.forEach((log) => {
      const current = logsByUser.get(log.assignedToId)
      if (!current || new Date(log.createdAt) > new Date(current.createdAt)) {
        logsByUser.set(log.assignedToId, log)
      }
    })

    const latestLogs = Array.from(logsByUser.values())
    const totalAssigned = latestLogs.length
    const completedCount = latestLogs.filter((log) => log.status === "COMPLETED").length
    const formPercent = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0

    const approvedCount = latestLogs.filter(
      (log) => log.status === "COMPLETED" && log.approved === true
    ).length
    const percentApproved =
      completedCount > 0 ? Math.round((approvedCount / completedCount) * 100) : 0

    return {
      taskName: task.name,
      formName: task.formVersion ? task.formVersion.name : "Unknown",
      taskId: task.id,
      projectId: task.projectId,
      formUi: task.formVersion?.uiSchema || {},
      formSchema: task.formVersion?.schema || {},
      percentComplete: formPercent,
      percentApproved: percentApproved,
    }
  })
}
