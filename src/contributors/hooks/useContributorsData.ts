import { usePaginatedQuery } from "@blitzjs/rpc"
import getContributors from "src/contributors/queries/getContributors"
import {
  processContributor,
  ContributorTableData,
} from "src/contributors/tables/processing/processContributor"
import { MemberPrivileges } from "@prisma/client"
import { useMemo } from "react"
import { CurrentUser } from "src/users/queries/getCurrentUser"
import { PaginationState } from "@tanstack/react-table"

type UseContributorsDataResult = {
  data: ContributorTableData[]
  count: number
  refetch: () => Promise<any>
}

export function useContributorsData(
  privilege: MemberPrivileges,
  currentUser: CurrentUser,
  projectId: number,
  pagination?: PaginationState
): UseContributorsDataResult {
  const shouldPaginate = privilege !== MemberPrivileges.CONTRIBUTOR && Boolean(pagination)

  const baseArgs = {
    projectId,
    deleted: false,
    orderBy: { id: "asc" as const },
  }

  const skip = pagination ? pagination.pageIndex * pagination.pageSize : 0
  const take = pagination ? pagination.pageSize : undefined

  const [{ contributors, count }, { refetch }] = usePaginatedQuery(getContributors, {
    ...baseArgs,
    skip,
    take,
  })

  const filteredContributors = useMemo(() => {
    if (privilege === MemberPrivileges.CONTRIBUTOR) {
      return contributors.filter(
        (contributor) =>
          contributor.users.length === 1 && contributor.users[0]?.id === currentUser.id
      )
    }
    return contributors
  }, [contributors, privilege, currentUser.id])

  const resultCount =
    privilege === MemberPrivileges.CONTRIBUTOR ? filteredContributors.length : count

  return {
    data: processContributor(filteredContributors, projectId),
    count: resultCount,
    refetch,
  }
}
