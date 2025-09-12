import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { MemberPrivileges } from "db"
import { TeamWithUsers } from "src/core/types"
import CollapseCard from "src/core/components/CollapseCard"
import DateField from "src/core/components/fields/DateField"
import DateFormat from "src/core/components/DateFormat"

interface TeamInformationProps {
  team: TeamWithUsers
  privilege: MemberPrivileges
}

const TeamInformation = ({ team, privilege }: TeamInformationProps) => {
  const users = team.users

  return (
    <CollapseCard title="Team Members" className="w-full mt-4">
      <div className="mb-2">
        <p>
          <span className="font-semibold">Created At:</span> <DateFormat date={team.createdAt} />
        </p>
        {team.tags && Array.isArray(team.tags) && team.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="font-semibold mr-2">Tags:</span>
            {team.tags.map((tag: { key: string; value: string }, index: number) => (
              <div
                key={index}
                className="bg-primary text-primary-content rounded px-2 py-1 text-md font-semibold"
              >
                {tag.value}
              </div>
            ))}
          </div>
        )}
      </div>
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
