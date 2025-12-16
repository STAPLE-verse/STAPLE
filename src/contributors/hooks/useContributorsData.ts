import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getContributors from "src/contributors/queries/getContributors"
import {
  processContributor,
  ContributorTableData,
} from "src/contributors/tables/processing/processContributor"
import { MemberPrivileges } from "@prisma/client"
import { useMemo } from "react"
import { CurrentUser } from "src/users/queries/getCurrentUser"
import { ProjectMemberWithUsers } from "src/core/types"
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

  let contributors: ProjectMemberWithUsers[] = []
  let count = 0
  let refetchFn: () => Promise<any>

  if (shouldPaginate) {
    const [{ contributors: pagedContributors, count: total }, { refetch }] = usePaginatedQuery(
      getContributors,
      {
        ...baseArgs,
        skip: pagination!.pageIndex * pagination!.pageSize,
        take: pagination!.pageSize,
      }
    )
    contributors = pagedContributors
    count = total
    refetchFn = refetch
  } else {
    const [{ contributors: allContributors }, { refetch }] = useQuery(getContributors, baseArgs)
    contributors = allContributors
    count = contributors.length
    refetchFn = refetch
  }

  const filteredContributors = useMemo(() => {
    if (privilege === MemberPrivileges.CONTRIBUTOR) {
      return contributors.filter(
        (contributor) =>
          contributor.users.length === 1 && contributor.users[0]?.id === currentUser.id
      )
    }
    return contributors
  }, [contributors, privilege, currentUser.id])

  return {
    data: processContributor(filteredContributors, projectId),
    count,
    refetch: refetchFn,
  }
}
