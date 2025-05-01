import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { MemberPrivileges } from "db"
import { TeamWithUsers } from "src/core/types"
import CollapseCard from "src/core/components/CollapseCard"

interface TeamInformationProps {
  team: TeamWithUsers
  privilege: MemberPrivileges
}

const TeamInformation = ({ team, privilege }: TeamInformationProps) => {
  const users = team.users

  return (
    <CollapseCard title="Team Members" className="w-full">
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
    </CollapseCard>
  )
}

export default TeamInformation
