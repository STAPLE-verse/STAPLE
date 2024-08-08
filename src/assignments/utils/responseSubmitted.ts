import { AssignmentStatus } from "@prisma/client"
import { ExtendedTask } from "src/tasks/components/TaskContext"

export function responseSubmitted(task: ExtendedTask): boolean {
  return task.assignees.every((assignment) =>
    assignment.statusLogs?.every((statusLog) => statusLog.status === AssignmentStatus.NOT_COMPLETED)
  )
}
