import { useQuery } from "@blitzjs/rpc"
import getContributors from "src/contributors/queries/getContributors"
import {
  processContributor,
  ContributorTableData,
} from "src/contributors/tables/processing/processContributor"
import { MemberPrivileges } from "@prisma/client"
import { useMemo } from "react"
import { CurrentUser } from "src/users/queries/getCurrentUser"
import { ProjectMemberWithUsers } from "src/core/types"

export function useContributorsData(
  privilege: MemberPrivileges,
  currentUser: CurrentUser,
  projectId: number
): ContributorTableData[] {
  // Fetch
  const [contributors] = useQuery(getContributors, { projectId: projectId, deleted: false })

  // Filter based on privilege
  const filteredContributors = useMemo(() => {
    if (privilege === MemberPrivileges.CONTRIBUTOR) {
      return contributors.filter(
        (contributor: ProjectMemberWithUsers) =>
          contributor.users.length === 1 && contributor.users[0]?.id === currentUser.id
      )
    }
    return contributors
  }, [contributors, privilege, currentUser.id])

  // Process the data for table rendering
  return processContributor(filteredContributors, projectId)
}
