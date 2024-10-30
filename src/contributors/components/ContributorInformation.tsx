import { useQuery } from "@blitzjs/rpc"
import { User } from "@prisma/client"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import { getPrivilegeText } from "src/services/getPrivilegeText"
import getTeamNames from "src/teams/queries/getTeamNames"

export const ContributorInformation = (contributorUser: User, projectId: number) => {
  // Get contributor privilege
  const [contributorPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: contributorUser!.id, projectId: projectId },
  })

  // Get team memberships for the user
  const [teamNames] = useQuery(getTeamNames, {
    userId: contributorUser!.id,
    projectId: projectId,
  })

  // Get contributor name
  const contributorUsername =
    contributorUser.firstName && contributorUser.lastName
      ? `${contributorUser.firstName} ${contributorUser.lastName}`
      : contributorUser.username

  return (
    <>
      <div className="card bg-base-300 w-full">
        <div className="card-body">
          <div className="card-title">{contributorUsername}</div>
          {contributorUser!.firstName && contributorUser!.lastName ? (
            <p>
              <span className="font-semibold">Username:</span> {contributorUsername}
            </p>
          ) : null}
          <p>
            <span className="font-semibold">Email:</span> {contributorUser!.email}
          </p>
          <p>
            <span className="font-semibold">Privilege:</span>{" "}
            {getPrivilegeText(contributorPrivilege.privilege)}
          </p>

          <p>
            <span className="font-semibold">Team Membership:</span>{" "}
            {teamNames.length > 0 ? teamNames.join(", ") : "No team memberships"}
          </p>
        </div>
      </div>
    </>
  )
}
