import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { getPrivilegeText } from "src/core/utils/getPrivilegeText"
import { MemberPrivileges, User } from "db"
import Card from "src/core/components/Card"

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
    <Card
      title={contributorName}
      className="w-full"
      actions={
        privilege === MemberPrivileges.PROJECT_MANAGER ? (
          <Link
            href={Routes.EditContributorPage({
              projectId: projectId,
              contributorId: contributorId,
            })}
            className="btn btn-primary"
          >
            Edit Contributor
          </Link>
        ) : null
      }
    >
      {contributorUser.firstName && contributorUser.lastName && (
        <p>
          <span className="font-semibold">Username:</span> {contributorUser.username}
        </p>
      )}
      <p>
        <span className="font-semibold">Email:</span> {contributorUser.email}
      </p>
      <p>
        <span className="font-semibold">Privilege:</span> {getPrivilegeText(contributorPrivilege)}
      </p>
      <p>
        <span className="font-semibold">Team Membership:</span>{" "}
        {teamNames.length > 0 ? teamNames.join(", ") : "No team memberships"}
      </p>
    </Card>
  )
}

export default ContributorInformation
