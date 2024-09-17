import { getProjectMemberName } from "src/services/getName"
import { ExtendedTaskLog, ExtendedTaskLogStatusLog, ExtendedTeam } from "../hooks/useTaskLogData"
import { Prisma } from "@prisma/client"

export type ProcessedIndividualTaskLog = {
  projectMemberName: string
  lastUpdate: string
  status: string
  assignment: ExtendedTaskLog
}

export function processIndividualTaskLogs(
  assignments: ExtendedTaskLog[]
): ProcessedIndividualTaskLog[] {
  return assignments.map((assignment) => {
    const latestLog = getLatestStatusLog(assignment.statusLogs)
    return {
      projectMemberName: getProjectMemberName(assignment.projectMember),
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
      assignment,
    }
  })
}

export type ProcessedTeamTaskLog = {
  team: ExtendedTeam
  lastUpdate: string
  status: string
  assignment: ExtendedTaskLog
}

export function processTeamTaskLogs(assignments: ExtendedTaskLog[]): ProcessedTeamTaskLog[] {
  return assignments.map((assignment) => {
    // Function fails if does not recieve assignment data for teams
    if (!assignment.team) {
      throw new Error(`Missing team data for assignment ID: ${assignment.id}`)
    }

    const latestLog = getLatestStatusLog(assignment.statusLogs)
    return {
      team: assignment.team,
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
      assignment,
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
  assignmentStatusLog: ExtendedTaskLogStatusLog[],
  schema?: any,
  ui?: any
): ProcessedTaskLogHistory[] {
  return assignmentStatusLog.map((statusLog) => {
    const processedData: ProcessedTaskLogHistory = {
      projectMemberName: statusLog.projectMember
        ? getProjectMemberName(statusLog.projectMember)
        : "Task created",
      lastUpdate: statusLog.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      status: statusLog.status === "COMPLETED" ? "Completed" : "Not Completed",
    }

    if (schema && ui) {
      processedData.formData = {
        metadata: statusLog.metadata,
        schema: schema,
        ui: ui,
      }
    }

    return processedData
  })
}
