import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import getProject from "src/projects/queries/getProject"
import {
  HomeSidebarItems,
  ProjectSidebarItems,
  SidebarItemProps,
} from "../components/sidebar/SidebarItems"
import { MemberPrivileges, Project } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import type { TFunction } from "i18next"

export interface SidebarState {
  sidebarTitle: string
  sidebarItems: SidebarItemProps[]
}

export const getSidebarState = (
  project: Project | undefined,
  privilege: MemberPrivileges | null | undefined,
  userPrivilege: string | null | undefined,
  t: TFunction
): SidebarState => {
  if (project && privilege) {
    const sidebarItems = ProjectSidebarItems(project.id, t).filter((item) => {
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
  } else if (userPrivilege) {
    const sidebarItems = HomeSidebarItems(t).filter((item) => {
      return (
        !item.userPrivilege ||
        !userPrivilege ||
        item.userPrivilege.some((itemPrivilege) => itemPrivilege === userPrivilege)
      )
    })
    return {
      sidebarTitle: "Home",
      sidebarItems,
    }
  } else {
    return {
      sidebarTitle: "Home",
      sidebarItems: HomeSidebarItems(t).filter((_, index) => index !== 7),
    }
  }
}

const useSidebar = (): SidebarState => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const [project] = useQuery(getProject, { id: projectId }, { enabled: !!projectId })
  const user = useCurrentUser()
  const userPrivilege = user ? user!.role : "USER"
  const translation = (useTranslation as any)()

  const sidebarState = useMemo(() => {
    return getSidebarState(project, privilege, userPrivilege, translation.t)
  }, [project, privilege, userPrivilege, translation.t])

  return sidebarState
}

export default useSidebar
