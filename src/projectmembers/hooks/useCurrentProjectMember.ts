import { useQuery } from "@blitzjs/rpc"
import getProjectMember from "../queries/getProjectMember"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useCurrentProjectMember = (projectId) => {
  const currentUser = useCurrentUser()

  const shouldFetch = !!(projectId && currentUser?.id)

  const [projectMember, { isLoading, isError }] = useQuery(
    getProjectMember,
    {
      where: {
        projectId: projectId,
        users: {
          some: {
            id: currentUser?.id,
          },
          every: {
            id: currentUser?.id, // Only this user should be in the users array
          },
        },
        name: null, // Ensures only individual ProjectMember is fetched
      },
    },
    {
      enabled: shouldFetch,
    }
  )

  if (!shouldFetch) {
    return { projectMember: null, isLoading: false, isError: false, enabled: shouldFetch }
  }

  return { projectMember, isLoading, isError, enabled: shouldFetch }
}
