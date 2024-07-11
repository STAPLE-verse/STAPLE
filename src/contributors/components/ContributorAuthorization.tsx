import React from "react"
import { useContributor } from "./ContributorContext"

const ContributorAuthorization = ({ requiredPrivileges, children }) => {
  const { state } = useContributor()
  const { contributor, loading, error } = state

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  if (!contributor || !requiredPrivileges.includes(contributor.privilege)) {
    return <div>Access Denied</div>
  }

  return children
}

export default ContributorAuthorization
