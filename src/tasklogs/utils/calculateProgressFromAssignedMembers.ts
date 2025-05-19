import { ProjectMemberWithTaskLog } from "src/core/types"
import { filterLatestTaskLog } from "./filterLatestTaskLog"

export function calculateProgressFromAssignedMembers(projectMembers: ProjectMemberWithTaskLog[]) {
  let completed = 0

  for (const member of projectMembers) {
    const logs = member.taskLogAssignedTo
    const latestLog = filterLatestTaskLog(logs)
    if (latestLog?.status === "COMPLETED") {
      completed++
    }
  }

  return {
    all: projectMembers.length,
    completed,
  }
}
