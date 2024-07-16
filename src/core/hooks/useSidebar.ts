import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useMemo } from "react"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import getProject from "src/projects/queries/getProject"
import {
  HomeSidebarItems,
  ProjectSidebarItems,
  SidebarItemProps,
} from "../components/sidebar/SidebarItems"
import { Contributor, Project } from "db"

export interface SidebarState {
  sidebarTitle: string
  sidebarItems: SidebarItemProps[]
}

export const getSidebarState = (
  project: Project | undefined,
  currentContributor: Contributor | null | undefined
): SidebarState => {
  if (project && currentContributor) {
    const sidebarItems = ProjectSidebarItems(project.id).filter((item) => {
      return (
        !item.privilege ||
        !currentContributor.privilege ||
        item.privilege.some((privilege) => currentContributor.privilege.includes(privilege))
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
  const { contributor: currentContributor } = useCurrentContributor(projectId)
  const [project] = useQuery(getProject, { id: projectId }, { enabled: !!projectId })

  const sidebarState = useMemo(() => {
    return getSidebarState(project, currentContributor)
  }, [project, currentContributor])

  return sidebarState
}

export default useSidebar
