import { useQuery } from "@blitzjs/rpc"
import getContributor from "../queries/getContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { NotFoundError } from "blitz"

export const useCurrentContributor = (projectId) => {
  const currentUser = useCurrentUser()

  const shouldFetch = !!(projectId && currentUser?.id)

  const [contributor, { isLoading, isError }] = useQuery(
    getContributor,
    {
      where: { projectId: projectId, userId: currentUser?.id },
    },
    {
      enabled: true,
    }
  )

  if (!shouldFetch) {
    return { contributor: null, isLoading: false, isError: false, enabled: shouldFetch }
  }

  return { contributor, isLoading, isError, enabled: shouldFetch }
}
