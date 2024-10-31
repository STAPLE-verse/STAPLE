import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { MemberPrivileges } from "db"
import Card from "src/core/components/Card"
import { ProjectMemberWithUsers } from "src/core/types"

interface TeamInformationProps {
  team: ProjectMemberWithUsers
  privilege: MemberPrivileges
}

const TeamInformation = ({ team, privilege }: TeamInformationProps) => {
  const users = team.users

  return (
    <Card
      title={team.name!}
      actions={
        privilege === MemberPrivileges.PROJECT_MANAGER ? (
          <Link
            href={Routes.EditTeamPage({
              projectId: team.projectId,
              teamId: team.id,
            })}
            className="btn btn-primary"
          >
            Edit Team
          </Link>
        ) : null
      }
    >
      {users.map((user) => {
        return (
          <p key={user.id}>
            {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </p>
        )
      })}
    </Card>
  )
}

export default TeamInformation
