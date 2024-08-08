import { ContributorPrivileges } from "db"
import { useContributorPrivilege } from "../components/ContributorPrivilegeContext"
import { AuthenticationError } from "blitz"

const useContributorAuthorization = (requiredPrivileges: ContributorPrivileges[]) => {
  const { privilege, isError, error } = useContributorPrivilege()

  if (isError && error instanceof Error) {
    throw new AuthenticationError(error?.message || "An error occurred")
  }

  if (!privilege || !requiredPrivileges.includes(privilege)) {
    throw new AuthenticationError("Access Denied")
  }

  return { isAuthorized: true }
}

export default useContributorAuthorization
