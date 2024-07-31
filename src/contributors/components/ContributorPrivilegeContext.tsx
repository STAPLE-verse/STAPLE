import { useParam } from "@blitzjs/next"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "../queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "db"

interface ContributorPrivilegeContextProps {
  privilege: ContributorPrivileges | null
  refetch: () => void
  isError: boolean
  error: unknown
}

const ContributorPrivilegeContext = createContext<ContributorPrivilegeContextProps>({
  privilege: null,
  refetch: () => {},
  isError: false,
  error: null,
})

export const ContributorPrivilegeProvider = ({ children }: { children: ReactNode }) => {
  const user = useCurrentUser()
  const projectId = useParam("projectId", "number")

  const [data, { isError, error, refetch }] = useQuery(
    getContributor,
    { where: { userId: user?.id, projectId: projectId } },
    { enabled: !!user && !!projectId, suspense: true }
  )

  const privilege = data ? data.privilege : null

  return (
    <ContributorPrivilegeContext.Provider value={{ privilege, refetch, isError, error }}>
      {children}
    </ContributorPrivilegeContext.Provider>
  )
}

export const useContributorPrivilege = () => {
  const context = useContext(ContributorPrivilegeContext)
  if (context === undefined) {
    throw new Error("usePrivilege must be used within a ContributorPrivilegeProvider")
  }
  return context
}
