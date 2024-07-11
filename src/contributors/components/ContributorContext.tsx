import { useParam } from "@blitzjs/next"
import React, { createContext, useContext, useState, useEffect } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "../queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { Contributor } from "db"

type ContributorContextType = {
  contributor: Contributor | null
  refetch: () => void
  isLoading: boolean
  isError: boolean
  error: unknown
}

const ContributorContext = createContext<ContributorContextType>({
  contributor: null,
  refetch: () => {},
  isLoading: false,
  isError: false,
  error: null,
})

export const ContributorProvider = ({ children }) => {
  const [contributor, setContributor] = useState<Contributor | null>(null)
  const user = useCurrentUser()
  const projectId = useParam("projectId", "number")

  const [data, { isLoading, isError, error, refetch }] = useQuery(
    getContributor,
    { where: { userId: user?.id, projectId: projectId } },
    { enabled: !!user && !!projectId }
  )

  useEffect(() => {
    if (data) {
      setContributor(data)
    }
  }, [data])

  return (
    <ContributorContext.Provider value={{ contributor, refetch, isLoading, isError, error }}>
      {children}
    </ContributorContext.Provider>
  )
}

export const useContributor = () => useContext(ContributorContext)
