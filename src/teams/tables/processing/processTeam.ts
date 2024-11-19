import { MemberPrivileges } from "db"
import { ProjectMemberWithUsers } from "src/core/types"

export type TeamData = {
  name: string
  id: number
  projectId?: number
}

export function processTeam(
  teams: ProjectMemberWithUsers[],
  privilege: MemberPrivileges,
  currentUserId: number | undefined,
  projectId: number
): TeamData[] {
  // Filter teams based on privilege
  const filteredTeams =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? teams.filter((team: ProjectMemberWithUsers) =>
          team.users.some((user) => user.id === currentUserId)
        )
      : teams

  // Map the filtered teams to TeamData
  return filteredTeams.map((team) => ({
    name: team.name ?? "Unknown",
    id: team.id,
    projectId: projectId,
  }))
}
