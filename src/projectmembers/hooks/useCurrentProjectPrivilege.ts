import { useQuery } from "@blitzjs/rpc"
import getProjectPrivilege from "../queries/getProjectPrivilege"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useCurrentProjectPrivilege = (projectId) => {
  const currentUser = useCurrentUser()

  const shouldFetch = !!(projectId && currentUser?.id)

  const [projectPrivilege, { isLoading, isError }] = useQuery(
    getProjectPrivilege,
    {
      where: { projectId: projectId, userId: currentUser?.id },
    },
    {
      enabled: shouldFetch,
    }
  )

  if (!shouldFetch) {
    return { projectPrivilege: null, isLoading: false, isError: false, enabled: shouldFetch }
  }

  return { projectPrivilege, isLoading, isError, enabled: shouldFetch }
}
