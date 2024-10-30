import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { getPrivilegeText } from "src/services/getPrivilegeText"
import { MemberPrivileges, User } from "db"

interface ContributorInformationProps {
  contributorId: number
  projectId: number
  privilege: MemberPrivileges
  teamNames: (string | null)[]
  contributorPrivilege: MemberPrivileges
  contributorUser: User
}

const ContributorInformation = ({
  contributorId,
  projectId,
  privilege,
  teamNames,
  contributorPrivilege,
  contributorUser,
}: ContributorInformationProps) => {
  const contributorName =
    contributorUser.firstName && contributorUser.lastName
      ? `${contributorUser.firstName} ${contributorUser.lastName}`
      : contributorUser.username

  return (
    <div className="card bg-base-300 w-full">
      <div className="card-body">
        <div className="card-title">{contributorName}</div>
        {contributorUser.firstName && contributorUser.lastName ? (
          <p>
            <span className="font-semibold">Username:</span> {contributorUser.username}
          </p>
        ) : null}
        <p>
          <span className="font-semibold">Email:</span> {contributorUser.email}
        </p>
        <p>
          <span className="font-semibold">Privilege:</span> {getPrivilegeText(contributorPrivilege)}
        </p>

        <p>
          <span className="font-semibold">Team Membership:</span>
          {teamNames.length > 0 ? teamNames.join(", ") : "No team memberships"}
        </p>

        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="card-actions justify-end">
            <Link
              href={Routes.EditContributorPage({
                projectId: projectId,
                contributorId: contributorId,
              })}
              className="btn btn-primary"
            >
              Edit Contributor
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContributorInformation
