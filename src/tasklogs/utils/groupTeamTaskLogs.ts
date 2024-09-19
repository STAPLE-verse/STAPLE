import { ExtendedTaskLog } from "../hooks/useTaskLogData"

// Function to group team task logs by assignedTo.id
export default function groupTeamTaskLogs(taskLogs: ExtendedTaskLog[]) {
  // Group task logs by assignedTo.id
  const groupedTaskLogs = taskLogs.reduce((acc, taskLog) => {
    // Ensure assignedTo and its id are present
    if (!taskLog.assignedTo || taskLog.assignedTo.id === undefined) {
      return acc
    }

    const assignedToId = taskLog.assignedTo.id
    const assignedToName = taskLog.assignedTo.name

    // Check if the assignedToId already exists in the accumulator
    if (!acc[assignedToId]) {
      acc[assignedToId] = {
        name: assignedToName ?? null, // Set the name from assignedTo or null
        taskLogs: [], // Initialize an empty taskLogs array
      }
    }

    // Push the current taskLog into the appropriate group
    acc[assignedToId].taskLogs.push(taskLog)

    return acc
  }, {} as { [key: number]: { name: string | null; taskLogs: ExtendedTaskLog[] } })

  // Convert the grouped object into an array of objects
  return Object.values(groupedTaskLogs)
}
