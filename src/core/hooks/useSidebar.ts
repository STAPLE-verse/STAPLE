import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useEffect, useMemo } from "react"
import getProject from "src/projects/queries/getProject"
import {
  HomeSidebarItems,
  ProjectSidebarItems,
  SidebarItemProps,
} from "../components/sidebar/SidebarItems"
import { MemberPrivileges, Project } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { useUserPrivileges } from "src/userprivileges/components/UserPrivilegesContext"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export interface SidebarState {
  sidebarTitle: string
  sidebarItems: SidebarItemProps[]
}

export const getSidebarState = (
  project: Project | undefined,
  privilege: MemberPrivileges | null | undefined,
  userPrivilege: string | null | undefined
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
  } else if (userPrivilege) {
    const sidebarItems = HomeSidebarItems().filter((item) => {
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
      sidebarItems: HomeSidebarItems().filter((_, index) => index !== 7),
    }
  }
}

const useSidebar = (): SidebarState => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const [project] = useQuery(getProject, { id: projectId }, { enabled: !!projectId })
  const user = useCurrentUser()
  const userPrivilege = user ? user!.role : "USER"

  const sidebarState = useMemo(() => {
    return getSidebarState(project, privilege, userPrivilege)
  }, [project, privilege, userPrivilege])

  return sidebarState
}

export default useSidebar
