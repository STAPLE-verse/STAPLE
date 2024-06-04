import { usePaginatedQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { ContributorPrivileges } from "@prisma/client"

const ITEMS_PER_PAGE = 10

export default function useProjecTasksListData(projectId: number | undefined, page: number) {
  const currentUser = useCurrentUser()

  let queryParams: GetTasksInput = {
    where: { project: { id: projectId } },
    orderBy: [{ id: "asc" }],
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  }

  if (currentUser) {
    if (currentUser.role === ContributorPrivileges.CONTRIBUTOR) {
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
