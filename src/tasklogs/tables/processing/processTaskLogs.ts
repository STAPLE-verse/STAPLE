import { getContributorName } from "src/core/utils/getName"
import { ExtendedTaskLog, TaskLogCompletedBy, TaskLogTaskCompleted } from "src/core/types"
import { MemberPrivileges, Prisma } from "@prisma/client"
import { ProjectMemberWithTaskLog } from "src/core/types"
import { filterLatestTaskLog } from "../../utils/filterLatestTaskLog"
import { filterFirstTaskLog } from "src/tasklogs/utils/filterFirstTaskLog"
import { CommentWithAuthor } from "src/core/types"

export type ProcessedIndividualTaskLog = {
  projectMemberName: string
  lastUpdate: Date | null
  status: string
  approved: boolean | null
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
  taskHistory?: ExtendedTaskLog[]
  schema?: Prisma.JsonValue | undefined
  ui?: Prisma.JsonValue | undefined
  refetchComments?: () => void
  overdue?: boolean
  privilege: MemberPrivileges
}

export function processIndividualTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[],
  taskName: string,
  currentContributor: number,
  privilege: MemberPrivileges,
  schema?: Prisma.JsonValue | undefined,
  ui?: Prisma.JsonValue | undefined,
  refetchComments?: () => void,
  deadline?: Date | null
): ProcessedIndividualTaskLog[] {
  return projectMembers.map((projectMember) => {
    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    const firstLog = filterFirstTaskLog(projectMember.taskLogAssignedTo)
    // Find comments for this taskLog
    const taskLogComments = comments.filter((c) => c.taskLogId === firstLog?.id)

    const overdue =
      deadline instanceof Date &&
      latestLog &&
      latestLog.status !== "COMPLETED" &&
      deadline.getTime() < latestLog.createdAt.getTime()

    return {
      projectMemberName: getContributorName(projectMember),
      lastUpdate: latestLog ? latestLog.createdAt : null,
      status: latestLog
        ? latestLog.status === "COMPLETED"
          ? "Completed"
          : "Not Completed"
        : "Unknown",
      approved: latestLog ? latestLog.approved : null,
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
      taskHistory: projectMember.taskLogAssignedTo,
      schema: schema,
      ui: ui,
      refetchComments: refetchComments,
      overdue,
      privilege: privilege,
    }
  })
}

export type ProcessedTeamTaskLog = {
  teamId: number
  deletedTeam: boolean
  lastUpdate: Date | null
  status: string
  approved: boolean | null
  taskLog: ExtendedTaskLog | undefined
  firstLogId: number | undefined
  comments: CommentWithAuthor[]
  type: string
  taskName: string
  newCommentsCount?: number
  taskHistory?: ExtendedTaskLog[]
  schema?: Prisma.JsonValue | undefined
  ui?: Prisma.JsonValue | undefined
  refetchComments?: () => void
  overdue?: boolean
  privilege: MemberPrivileges
}

export function processTeamTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[],
  comments: CommentWithAuthor[],
  taskName: string,
  currentContributor: number,
  privilege: MemberPrivileges,
  schema?: Prisma.JsonValue | undefined,
  ui?: Prisma.JsonValue | undefined,
  refetchComments?: () => void,
  deadline?: Date | null
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

    const overdue =
      deadline instanceof Date &&
      latestLog &&
      latestLog.status !== "COMPLETED" &&
      deadline.getTime() < latestLog.createdAt.getTime()

    return {
      teamId: projectMember.id,
      deletedTeam: projectMember.deleted,
      lastUpdate: latestLog ? latestLog.createdAt : null,
      status: latestLog
        ? latestLog.status === "COMPLETED"
          ? "Completed"
          : "Not Completed"
        : "Unknown",
      approved: latestLog ? latestLog.approved : null,
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
      taskHistory: projectMember.taskLogAssignedTo,
      schema: schema,
      ui: ui,
      refetchComments: refetchComments,
      overdue,
      privilege: privilege,
    }
  })
}

export type ProcessedTaskLogHistory = {
  id: number
  taskName: string
  lastUpdate: Date
  status: string
  approved: boolean | null
  taskLog: ExtendedTaskLog
  taskHistory: ExtendedTaskLog[]
  comments: CommentWithAuthor[]
  refetchComments?: () => void
  newCommentsCount?: number
  refetchTaskData?: () => void
}

export function processTaskLogHistory(
  taskLogs: TaskLogTaskCompleted[],
  comments: CommentWithAuthor[],
  refetchComments?: () => void,
  currentContributor?: number,
  refetchTaskData?: () => void
): ProcessedTaskLogHistory[] {
  const groupedByTask = taskLogs.reduce((acc, log) => {
    if (!acc[log.taskId]) acc[log.taskId] = []
    acc[log.taskId]!.push(log)
    return acc
  }, {} as Record<number, TaskLogTaskCompleted[]>)

  return Object.values(groupedByTask).map((logs) => {
    const latestLog = filterLatestTaskLog(logs) as TaskLogTaskCompleted
    const firstLog = filterFirstTaskLog(logs) as TaskLogTaskCompleted

    const overdue =
      latestLog?.task.deadline instanceof Date &&
      latestLog.status !== "COMPLETED" &&
      latestLog.task.deadline.getTime() < latestLog.createdAt.getTime()

    return {
      id: latestLog!.id,
      taskName: latestLog!.task.name ?? "Untitled Task",
      lastUpdate: latestLog!.createdAt,
      status: latestLog!.status === "COMPLETED" ? "Completed" : "Not Completed",
      approved: latestLog.approved,
      taskLog: latestLog,
      taskHistory: logs as ExtendedTaskLog[],
      comments: (comments ?? []).filter((c) => c.taskLogId === firstLog?.id),
      refetchComments,
      newCommentsCount:
        (comments ?? []).filter(
          (c) =>
            c.taskLogId === firstLog?.id &&
            c.commentReadStatus?.some(
              (status) => status.projectMemberId === currentContributor && !status.read
            )
        ).length ?? 0,
      schema: latestLog.task.formVersion?.schema,
      ui: latestLog.task.formVersion?.uiSchema,
      overdue,
      firstLogId: firstLog.id,
      refetchTaskData,
    }
  })
}

export type ProcessedTaskLogHistoryModal = {
  id: number
  projectMemberName: string
  lastUpdate: Date
  status: string
  approved: boolean | null
  privilege: MemberPrivileges
  formData?: {
    metadata: Prisma.JsonValue
    schema: Prisma.JsonValue
    ui: Prisma.JsonValue
  }
}

export function processTaskLogHistoryModal(
  taskLogs: TaskLogCompletedBy[],
  privilege: MemberPrivileges,
  schema?: any,
  ui?: any
): ProcessedTaskLogHistoryModal[] {
  return taskLogs.map((taskLog) => {
    const processedData: ProcessedTaskLogHistoryModal = {
      id: taskLog.id,
      projectMemberName: taskLog.completedBy
        ? getContributorName(taskLog.completedBy)
        : "Task created",
      lastUpdate: taskLog!.createdAt,
      status: taskLog.status === "COMPLETED" ? "Completed" : "Not Completed",
      approved: taskLog.approved,
      privilege: privilege,
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
