import { useQuery } from "@blitzjs/rpc"
import getContributor from "../queries/getContributor"
import { useParam } from "@blitzjs/next"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useCurrentContributor = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [contributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  return contributor
}
