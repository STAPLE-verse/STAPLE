import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { ContributorPrivileges } from "@prisma/client"
import getContributor from "src/contributors/queries/getContributor"

const ITEMS_PER_PAGE = 10

export default function useProjecTasksListData(projectId: number | undefined, page: number) {
  const currentUser = useCurrentUser()

  // TODO: In another branch this is replaced by a hook once merged this needs to be updated
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  let queryParams: GetTasksInput = {
    where: { project: { id: projectId } },
    orderBy: [{ id: "asc" }],
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  }

  if (currentContributor && currentUser) {
    if (currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR) {
      queryParams.where = {
        ...queryParams.where,
        OR: [
          { assignees: { some: { contributor: { user: { id: currentUser.id } }, teamId: null } } },
          {
            assignees: {
              some: {
                team: { contributors: { some: { id: currentUser.id } } },
                contributorId: null,
              },
            },
          },
        ],
      }
    }
  }

  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, queryParams)

  return { tasks, hasMore }
}
