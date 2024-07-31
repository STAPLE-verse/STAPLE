import { getContributorName } from "src/services/getName"
import { ExtendedAssignment, ExtendedTeam } from "../hooks/useAssignmentData"
import { getLatestStatusLog } from "./getLatestStatusLog"

export type ProcessedIndividualAssignment = {
  contributorName: string
  lastUpdate: string
  status: string
  assignment: ExtendedAssignment
}

export function processIndividualAssignments(
  assignments: ExtendedAssignment[]
): ProcessedIndividualAssignment[] {
  return assignments.map((assignment) => {
    const latestLog = getLatestStatusLog(assignment.statusLogs)
    return {
      contributorName: getContributorName(assignment.contributor),
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

export type ProcessedTeamAssignment = {
  team: ExtendedTeam
  lastUpdate: string
  status: string
  assignment: ExtendedAssignment
}

export function processTeamAssignments(
  assignments: ExtendedAssignment[]
): ProcessedTeamAssignment[] {
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
