import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "../components/MemberPrivilegesContext"
import { AuthenticationError } from "blitz"

const useProjectMemberAuthorization = (requiredPrivileges: MemberPrivileges[]) => {
  const { privilege, isError, error } = useMemberPrivileges()

  if (isError && error instanceof Error) {
    throw new AuthenticationError(error?.message || "An error occurred")
  }

  if (!privilege || !requiredPrivileges.includes(privilege)) {
    throw new AuthenticationError("Access Denied")
  }

  return { isAuthorized: true }
}

export default useProjectMemberAuthorization
