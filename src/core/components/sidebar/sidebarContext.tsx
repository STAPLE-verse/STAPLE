import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "@prisma/client"
import React, { createContext, useState, useMemo, ReactNode, useEffect } from "react"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import getProject from "src/projects/queries/getProject"
import { SidebarItemProps } from "./SidebarItems"
import { ProjectSidebarItems, HomeSidebarItems } from "./SidebarItems"

interface SidebarState {
  sidebarTitle: string
  sidebarPrivilege?: ContributorPrivileges[]
  isProjectSidebar: boolean
  expanded: boolean
  sidebarItems: SidebarItemProps[]
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
    sidebarItems: HomeSidebarItems(),
  })

  const projectId = useParam("projectId", "number")

  const { contributor: currentContributor } = useCurrentContributor(projectId)

  const handleSetSidebarState = (updates: Partial<SidebarState>) => {
    setSidebarState((prev) => ({ ...prev, ...updates }))
  }

  const [project] = useQuery(
    getProject,
    { id: projectId },
    {
      enabled: !!projectId,
    }
  )

  useEffect(() => {
    if (project) {
      const newPrivileges = currentContributor ? [currentContributor.privilege] : undefined
      setSidebarState((prev) => ({
        ...prev,
        sidebarPrivilege: newPrivileges,
        sidebarTitle: project.name,
        sidebarItems: ProjectSidebarItems(project.id),
      }))
    } else {
      setSidebarState((prev) => ({
        ...prev,
        sidebarPrivilege: undefined,
        sidebarTitle: "Home",
        sidebarItems: HomeSidebarItems(),
      }))
    }
  }, [project, currentContributor])

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
