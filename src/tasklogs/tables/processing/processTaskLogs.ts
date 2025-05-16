import { getContributorName } from "src/core/utils/getName"
import { ExtendedTaskLog, TaskLogCompletedBy } from "src/core/types"
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
  contributorId: number
  projectId: number
  type: string
  teamId?: number
  deletedTeam?: string
  taskName: string
  newCommentsCount?: number
}

export function processIndividualTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[],
  taskName: string,
  currentContributor: number
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
      newCommentsCount:
        taskLogComments?.filter((comment) =>
          comment.commentReadStatus?.some(
            (status) => status.projectMemberId === currentContributor && !status.read
          )
        ).length ?? 0,
      contributorId: projectMember.id,
      projectId: projectMember.projectId,
      type: "Individual",
      taskName: taskName,
    }
  })
}

export type ProcessedTeamTaskLog = {
  teamId: number
  deletedTeam: boolean
  lastUpdate: string
  status: string
  taskLog: ExtendedTaskLog | undefined
  firstLogId: number | undefined
  comments: CommentWithAuthor[]
  type: string
  taskName: string
  newCommentsCount?: number
}

export function processTeamTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[],
  taskName: string,
  currentContributor: number
): ProcessedTeamTaskLog[] {
  return projectMembers.map((projectMember) => {
    // Function fails if does not receive assignment data for teams
    if (!projectMember.name) {
      throw new Error(`Missing team data for assignment ID: ${projectMember.id}`)
    }

    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    const firstLog = filterFirstTaskLog(projectMember.taskLogAssignedTo)

    // Find comments for this team's task log
    const taskLogComments = comments.filter((c) => c.taskLogId === firstLog?.id)

    return {
      teamId: projectMember.id,
      deletedTeam: projectMember.deleted,
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
      newCommentsCount:
        taskLogComments?.filter((comment) =>
          comment.commentReadStatus?.some(
            (status) => status.projectMemberId === currentContributor && !status.read
          )
        ).length ?? 0,
      type: "Team",
      taskName: taskName,
    }
  })
}

export type ProcessedTaskLogHistory = {
  id: number
  projectMemberName: string
  lastUpdate: string
  status: string
  approved: boolean | null
  formData?: {
    metadata: Prisma.JsonValue
    schema: Prisma.JsonValue
    ui: Prisma.JsonValue
  }
}

export function processTaskLogHistory(
  taskLogs: TaskLogCompletedBy[],
  schema?: any,
  ui?: any
): ProcessedTaskLogHistory[] {
  return taskLogs.map((taskLog) => {
    const processedData: ProcessedTaskLogHistory = {
      id: taskLog.id,
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
      approved: taskLog.approved,
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
