import { useQuery } from "@blitzjs/rpc"
import getContributor from "../queries/getContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useCurrentContributor = (projectId) => {
  const currentUser = useCurrentUser()

  const shouldFetch = !!(projectId && currentUser?.id)

  const [contributor, { isLoading, isError }] = useQuery(
    getContributor,
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
