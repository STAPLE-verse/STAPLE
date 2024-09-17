import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks, { GetTasksInput } from "../queries/getTasks"
import { MemberPrivileges } from "@prisma/client"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import { processProjectTasks } from "../utils/processTasks"

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
            assignees: { some: { projectMember: { user: { id: currentUser.id } }, teamId: null } },
          },
          {
            assignees: {
              some: {
                team: { projectMembers: { some: { id: currentUser.id } } },
                projectMemberId: null,
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
