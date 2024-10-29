import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { MemberPrivileges } from "@prisma/client"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { processProjectTasks } from "../tables/processing/processProjectTasks"

export default function useProjecTasksListData(projectId: number | undefined) {
  const currentUser = useCurrentUser()

  const { privilege } = useMemberPrivileges()

  let queryParams: GetTasksInput = {
    where: { project: { id: projectId } },
    orderBy: [{ id: "asc" }],
  }

  if (privilege && currentUser) {
    if (privilege === MemberPrivileges.CONTRIBUTOR) {
      queryParams.where = {
        ...queryParams.where,
        OR: [
          {
            assignedMembers: {
              some: {
                users: {
                  some: {
                    id: currentUser.id,
                  },
                },
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
