import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "@prisma/client"
import React, { createContext, useState, useMemo, ReactNode, useEffect } from "react"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import getProject from "src/projects/queries/getProject"

interface SidebarState {
  sidebarTitle: string
  sidebarPrivilege?: Set<ContributorPrivileges>
  isProjectSidebar: boolean
  expanded: boolean
}

interface SidebarContextProps extends SidebarState {
  setSidebarState: (state: Partial<SidebarState>) => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    sidebarTitle: "Home",
    expanded: true,
    isProjectSidebar: false,
  })

  const projectId = useParam("projectId", "number")

  const [project] = useQuery(
    getProject,
    { id: projectId },
    {
      enabled: !!projectId,
    }
  )

  const { contributor: currentContributor } = useCurrentContributor(projectId)

  useEffect(() => {
    if (project) {
      const newPrivileges = currentContributor ? new Set([currentContributor.privilege]) : undefined
      setSidebarState((prev) => ({
        ...prev,
        sidebarPrivilege: newPrivileges,
        sidebarTitle: project.name,
        isProjectSidebar: true,
      }))
    } else {
      setSidebarState((prev) => ({
        ...prev,
        sidebarPrivilege: undefined,
        sidebarTitle: "Home",
        isProjectSidebar: false,
      }))
    }
  }, [project, currentContributor])

  const handleSetSidebarState = (updates: Partial<SidebarState>) => {
    setSidebarState((prev) => ({ ...prev, ...updates }))
  }

  const value = useMemo(
    () => ({
      ...sidebarState,
      setSidebarState: handleSetSidebarState,
    }),
    [sidebarState]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export default SidebarContext
