import React from "react"
import { useContributor } from "./ContributorContext"

const ContributorAuthorization = ({ requiredPrivileges, children }) => {
  const { contributor, isLoading, isError, error } = useContributor()

  if (isLoading) return <div>Loading...</div>
  if (isError && error instanceof Error) return <div>Error: {error.message}</div>

  if (!contributor || !requiredPrivileges.includes(contributor.privilege)) {
    return <div>Access Denied</div>
  }

  return children
}

export default ContributorAuthorization
