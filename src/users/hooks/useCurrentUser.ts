import { useQuery } from "@blitzjs/rpc"
import { useEffect } from "react"
import getCurrentUser from "src/users/queries/getCurrentUser"

export const useCurrentUser = () => {
  const [user, { refetch }] = useQuery(getCurrentUser, null)

  useEffect(() => {
    if (!user) {
      void refetch() // Ignore the promise
    }
  }, [user, refetch])

  return user
}
