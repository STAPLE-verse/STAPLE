import { useQuery } from "@blitzjs/rpc"
import React, { createContext, useContext, ReactNode, useEffect } from "react"
import getCurrentUser from "src/users/queries/getCurrentUser"

interface UserPrivilegesContextProps {
  userPrivilege: string | null
  refetch: () => void
  isError: boolean
  error: unknown
}

const UserPrivilegesContext = createContext<UserPrivilegesContextProps>({
  userPrivilege: "CHEESE",
  refetch: () => {},
  isError: false,
  error: null,
})

export const UserPrivilegesProvider = ({ children }: { children: ReactNode }) => {
  const [data, { isError, error, refetch }] = useQuery(getCurrentUser, null)
  const userPrivilege = data ? data.role : "USER"

  return (
    <UserPrivilegesContext.Provider value={{ userPrivilege, refetch, isError, error }}>
      {children}
    </UserPrivilegesContext.Provider>
  )
}

export const useUserPrivileges = () => {
  const context = useContext(UserPrivilegesContext)
  if (context === undefined) {
    throw new Error("usePrivilege must be used within a UserPrivilegesProvider")
  }
  return context
}
