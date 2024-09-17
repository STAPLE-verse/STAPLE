import { useQuery } from "@blitzjs/rpc"
import getProjectMember from "../queries/getProjectMember"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useCurrentProjectMember = (projectId) => {
  const currentUser = useCurrentUser()

  const shouldFetch = !!(projectId && currentUser?.id)

  const [contributor, { isLoading, isError }] = useQuery(
    getProjectMember,
    {
      where: { projectId: projectId, userId: currentUser?.id },
    },
    {
      enabled: shouldFetch,
    }
  )

  if (!shouldFetch) {
    return { contributor: null, isLoading: false, isError: false, enabled: shouldFetch }
  }

  return { contributor, isLoading, isError, enabled: shouldFetch }
}
