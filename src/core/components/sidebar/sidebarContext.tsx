import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import React, { createContext, useState, useMemo, ReactNode, useEffect } from "react"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import getProject from "src/projects/queries/getProject"
import { SidebarItemProps } from "./SidebarItems"
import { ProjectSidebarItems, HomeSidebarItems } from "./SidebarItems"

interface SidebarState {
  sidebarTitle: string
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
    sidebarItems: HomeSidebarItems(),
  })

  // Sidebar has two different states: home or project specific sidebar
  const projectId = useParam("projectId", "number")
  const { contributor: currentContributor } = useCurrentContributor(projectId)
  const [project] = useQuery(
    getProject,
    { id: projectId },
    {
      enabled: !!projectId,
    }
  )

  useEffect(() => {
    if (project && currentContributor) {
      const sidebarItems = ProjectSidebarItems(project.id).filter((item) => {
        return (
          !item.privilege ||
          !currentContributor.privilege ||
          item.privilege.some((privilege) => currentContributor.privilege.includes(privilege))
        )
      })
      setSidebarState((prev) => ({
        ...prev,
        sidebarTitle: project.name,
        sidebarItems: sidebarItems,
      }))
    } else {
      setSidebarState((prev) => ({
        ...prev,
        sidebarTitle: "Home",
        sidebarItems: HomeSidebarItems(),
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
