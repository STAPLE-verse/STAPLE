import { TaskwithFormandLog } from "src/forms/components/ProjectFormsList"
import { Prisma, TaskLog } from "db"
import { useQuery } from "@blitzjs/rpc"
import { TaskLogWithTask } from "src/core/types"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"

export type ProjectFormData = {
  taskName: string
  formName: string
  taskId: number
  projectId: number
  formUi: Prisma.JsonValue
  formSchema: Prisma.JsonValue
  percentComplete: number
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

    return {
      taskName: task.name,
      formName: task.formVersion ? task.formVersion.name : "Unknown",
      taskId: task.id,
      projectId: task.projectId,
      formUi: task.formVersion?.uiSchema || {},
      formSchema: task.formVersion?.schema || {},
      percentComplete: formPercent,
    }
  })
}
