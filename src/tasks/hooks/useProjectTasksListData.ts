import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { ContributorPrivileges } from "@prisma/client"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"
import { processProjectTasks } from "../utils/processTasks"

export default function useProjecTasksListData(projectId: number | undefined) {
  const currentUser = useCurrentUser()

  const { privilege } = useContributorPrivilege()

  let queryParams: GetTasksInput = {
    where: { project: { id: projectId } },
    orderBy: [{ id: "asc" }],
  }

  if (privilege && currentUser) {
    if (privilege === ContributorPrivileges.CONTRIBUTOR) {
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

  const [{ tasks: fetchedTasks }] = useQuery(getTasks, queryParams)

  const tasks = processProjectTasks(fetchedTasks)

  return { tasks }
}
