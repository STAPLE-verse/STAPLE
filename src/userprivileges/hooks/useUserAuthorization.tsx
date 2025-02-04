import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { AuthenticationError } from "blitz"

const useUserAuthorization = (userPrivileges: string) => {
  //const { userPrivilege, isError, error } = useUserPrivileges()
  const user = useCurrentUser()
  const userPrivilege = user ? user!.role : "USER"

  if (!userPrivilege || userPrivileges != "ADMIN") {
    throw new AuthenticationError("Access Denied")
  }

  return { isAuthorized: true }
}

export default useUserAuthorization
