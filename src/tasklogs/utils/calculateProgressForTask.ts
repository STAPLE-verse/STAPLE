import { filterLatestTaskLog } from "./filterLatestTaskLog"
import { TaskLog } from "db"

export function calculateProgressForTask(
  assignedMembers: { id: number }[],
  logs: Pick<TaskLog, "assignedToId" | "status" | "createdAt">[]
) {
  let completed = 0
  for (const m of assignedMembers) {
    // only pick this member’s logs for THIS task
    const memberLogs = logs.filter((log) => log.assignedToId === m.id)
    const latest = filterLatestTaskLog(memberLogs)
    if (latest?.status === "COMPLETED") completed++
  }
  return { all: assignedMembers.length, completed }
}
