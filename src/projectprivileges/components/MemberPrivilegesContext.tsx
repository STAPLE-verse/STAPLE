import { useParam } from "@blitzjs/next"
import React, { createContext, useContext, ReactNode } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectPrivilege from "../queries/getProjectPrivilege"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges } from "db"

interface MemberPrivilegesContextProps {
  privilege: MemberPrivileges | null
  refetch: () => void
  isError: boolean
  error: unknown
}

const MemberPrivilegesContext = createContext<MemberPrivilegesContextProps>({
  privilege: null,
  refetch: () => {},
  isError: false,
  error: null,
})

export const MemberPrivilegesProvider = ({ children }: { children: ReactNode }) => {
  const user = useCurrentUser()
  const projectId = useParam("projectId", "number")

  const [data, { isError, error, refetch }] = useQuery(
    getProjectPrivilege,
    { where: { userId: user?.id, projectId: projectId } },
    { enabled: !!user && !!projectId, suspense: true }
  )

  const privilege = data ? data.privilege : null

  return (
    <MemberPrivilegesContext.Provider value={{ privilege, refetch, isError, error }}>
      {children}
    </MemberPrivilegesContext.Provider>
  )
}

export const useMemberPrivileges = () => {
  const context = useContext(MemberPrivilegesContext)
  if (context === undefined) {
    throw new Error("usePrivilege must be used within a MemberPrivilegesProvider")
  }
  return context
}
