import { useQuery } from "@blitzjs/rpc"
import getContributor from "src/contributors/queries/getContributor"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import getTeamNames from "src/teams/queries/getTeamNames"

export const useContributorData = (contributorId: number, projectId: number) => {
  const [contributor] = useQuery(getContributor, { contributorId: contributorId })
  const contributorUser = contributor?.users[0]

  const [contributorPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: contributorUser!.id, projectId: projectId },
  })

  const [teamNames] = useQuery(getTeamNames, {
    userId: contributorUser!.id,
    projectId: projectId,
  })

  return {
    contributor,
    contributorUser,
    contributorPrivilege: contributorPrivilege.privilege,
    teamNames,
  }
}
