import { getProjectMemberName } from "src/services/getName"
import { ExtendedTaskLog } from "../hooks/useTaskLogData"
import { Prisma } from "@prisma/client"
import { ProjectMemberWithTaskLog } from "src/tasks/components/TaskContext"
import { filterLatestTaskLog } from "./filterLatestTaskLog"

export type ProcessedIndividualTaskLog = {
  projectMemberName: string
  lastUpdate: string
  status: string
  taskLog: ExtendedTaskLog | undefined
}

export function processIndividualTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[]
): ProcessedIndividualTaskLog[] {
  return projectMembers.map((projectMember) => {
    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    return {
      projectMemberName: getProjectMemberName(projectMember),
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
    }
  })
}

export type ProcessedTeamTaskLog = {
  projectMember: ProjectMemberWithTaskLog
  lastUpdate: string
  status: string
  taskLog: ExtendedTaskLog | undefined
}

export function processTeamTaskLogs(
  projectMembers: ProjectMemberWithTaskLog[]
): ProcessedTeamTaskLog[] {
  return projectMembers.map((projectMember) => {
    // Function fails if does not recieve assignment data for teams
    if (!projectMember.name) {
      throw new Error(`Missing team data for assignment ID: ${projectMember.id}`)
    }

    const latestLog = filterLatestTaskLog(projectMember.taskLogAssignedTo)
    return {
      projectMember,
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
      projectMemberName: taskLog.assignedTo
        ? getProjectMemberName(taskLog.assignedTo)
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
