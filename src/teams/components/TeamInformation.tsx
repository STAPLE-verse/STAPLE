import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { MemberPrivileges } from "db"
import Card from "src/core/components/Card"
import { TeamWithUsers } from "src/core/types"

interface TeamInformationProps {
  team: TeamWithUsers
  privilege: MemberPrivileges
}

const TeamInformation = ({ team, privilege }: TeamInformationProps) => {
  const users = team.users

  return (
    <Card
      title={team.name!}
      className="w-full"
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
      <div className="flex flex-row justify-start gap-2">
        {users.map((user) => {
          return (
            <Link
              key={user.id}
              className="btn btn-primary"
              href={Routes.ShowContributorPage({
                projectId: team.projectId,
                contributorId: user.contributorId,
              })}
            >
              {user.firstName || user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

export default TeamInformation
