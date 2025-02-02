import { TaskLog, ProjectMember, User, Comment } from "db"
import { ExtendedTask } from "src/tasks/components/TaskContext"

// TODO: Possible that the function can be factored out or refactored due to the new schema structure
// Creating custom types
// Extend ProjectMember to include User with only username
export type ExtendedProjectMember = ProjectMember & {
  users: Pick<User, "id" | "username">[]
}

export type ExtendedTaskLog = TaskLog & {
  completedBy: ExtendedProjectMember
  comments?: Comment[]
}

type useTaskLogDataType = {
  individualTaskLogs: ExtendedTaskLog[]
  teamTaskLogs: ExtendedTaskLog[]
}

// Hook to get TaskLog data from task returned by taskContext
export default function useTaskLogData(task: ExtendedTask): useTaskLogDataType {
  // Get taskLogs
  const taskLogs = task.taskLogs

  // Filter out individual assignments
  const individualTaskLogs = taskLogs.filter((taskLog) => taskLog.assignedTo.name === null)

  // Filter out team assignments
  const teamTaskLogs = taskLogs.filter((taskLog) => taskLog.assignedTo.name != null)

  return {
    individualTaskLogs,
    teamTaskLogs,
  }
}
