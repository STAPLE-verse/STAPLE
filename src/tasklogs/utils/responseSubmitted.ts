import { Status } from "@prisma/client"
import { ExtendedTask } from "src/core/types"

export function responseSubmitted(task: ExtendedTask): boolean {
  return task.assignedMembers.every((projectMember) =>
    projectMember.taskLogAssignedTo.every((taskLog) => taskLog.status === Status.NOT_COMPLETED)
  )
}
