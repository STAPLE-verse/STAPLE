import { getContributorName } from "src/core/utils/getName"
import { ExtendedTaskLog } from "src/core/types"
import { Prisma } from "@prisma/client"
import { ProjectMemberWithTaskLog } from "src/core/types"
import { filterLatestTaskLog } from "../../utils/filterLatestTaskLog"
import { filterFirstTaskLog } from "src/tasklogs/utils/filterFirstTaskLog"
import { CommentWithAuthor } from "src/core/types"

export type ProcessedIndividualTaskLog = {
  projectMemberName: string
  lastUpdate: string
  status: string
  taskLog: ExtendedTaskLog | undefined
  firstLogId: number | undefined
  comments: CommentWithAuthor[]
}

export function processIndividualTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[]
): ProcessedIndividualTaskLog[] {
  return projectMembers.map((projectMember) => {
    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    const firstLog = filterFirstTaskLog(projectMember.taskLogAssignedTo)
    // Find comments for this taskLog
    const taskLogComments = comments.filter((c) => c.taskLogId === firstLog?.id)

    return {
      projectMemberName: getContributorName(projectMember),
      lastUpdate: latestLog
        ? latestLog.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        : "No update",
      status: latestLog
        ? latestLog.status === "COMPLETED"
          ? "Completed"
          : "Not Completed"
        : "Unknown",
      taskLog: latestLog,
      firstLogId: firstLog?.id,
      comments: taskLogComments,
    }
  })
}

export type ProcessedTeamTaskLog = {
  projectMember: ProjectMemberWithTaskLog
  lastUpdate: string
  status: string
  taskLog: ExtendedTaskLog | undefined
  firstLogId: number | undefined
  comments: CommentWithAuthor[]
}

export function processTeamTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[]
): ProcessedTeamTaskLog[] {
  return projectMembers.map((projectMember) => {
    // Function fails if does not recieve assignment data for teams
    if (!projectMember.name) {
      throw new Error(`Missing team data for assignment ID: ${projectMember.id}`)
    }

    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    const firstLog = filterFirstTaskLog(projectMember.taskLogAssignedTo)

    // Find comments for this team's task log
    const taskLogComments = comments.filter((c) => c.taskLogId === firstLog?.id)

    return {
      projectMember: projectMember,
      lastUpdate: latestLog
        ? latestLog.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        : "No update",
      status: latestLog
        ? latestLog.status === "COMPLETED"
          ? "Completed"
          : "Not Completed"
        : "Unknown",
      taskLog: latestLog,
      users: projectMember.users,
      firstLogId: firstLog?.id,
      comments: taskLogComments,
    }
  })
}

export type ProcessedTaskLogHistory = {
  projectMemberName: string
  lastUpdate: string
  status: string
  formData?: {
    metadata: Prisma.JsonValue
    schema: Prisma.JsonValue
    ui: Prisma.JsonValue
  }
}

export function processTaskLogHistory(
  taskLogs: ExtendedTaskLog[],
  schema?: any,
  ui?: any
): ProcessedTaskLogHistory[] {
  return taskLogs.map((taskLog) => {
    const processedData: ProcessedTaskLogHistory = {
      projectMemberName: taskLog.completedBy
        ? getContributorName(taskLog.completedBy)
        : "Task created",
      lastUpdate: taskLog.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      status: taskLog.status === "COMPLETED" ? "Completed" : "Not Completed",
    }

    if (schema && ui) {
      processedData.formData = {
        metadata: taskLog.metadata,
        schema: schema,
        ui: ui,
      }
    }

    return processedData
  })
}
