import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useMemo } from "react"
import getProject from "src/projects/queries/getProject"
import {
  HomeSidebarItems,
  ProjectSidebarItems,
  SidebarItemProps,
} from "../components/sidebar/SidebarItems"
import { ContributorPrivileges, Project } from "db"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"

export interface SidebarState {
  sidebarTitle: string
  sidebarItems: SidebarItemProps[]
}

export const getSidebarState = (
  project: Project | undefined,
  privilege: ContributorPrivileges | null | undefined
): SidebarState => {
  if (project && privilege) {
    const sidebarItems = ProjectSidebarItems(project.id).filter((item) => {
      return (
        !item.privilege ||
        !privilege ||
        item.privilege.some((itemPrivilege) => itemPrivilege === privilege)
      )
    })
    return {
      sidebarTitle: project.name,
      sidebarItems,
    }
  } else {
    return {
      sidebarTitle: "Home",
      sidebarItems: HomeSidebarItems(),
    }
  }
}

const useSidebar = (): SidebarState => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useContributorPrivilege()
  const [project] = useQuery(getProject, { id: projectId }, { enabled: !!projectId })

  const sidebarState = useMemo(() => {
    return getSidebarState(project, privilege)
  }, [project, privilege])

  return sidebarState
}

export default useSidebar
