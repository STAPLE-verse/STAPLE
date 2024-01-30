import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/router"
import { SidebarItemProps } from "../components/Sidebar"
import { Routes } from "@blitzjs/next"

export const ProjectSidebarItems = (
  projectId: number,
  whichActive: string | null = null
): SidebarItemProps[] => {
  const router = useRouter()

  return [
    {
      icon: <RectangleGroupIcon className="w-6 h-6" />,
      text: "Dashboard",
      onClick: async () => {
        await router.push(Routes.ShowProjectPage({ projectId: projectId }))
      },
      active: whichActive === "Dashboard",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      text: "Tasks",
      onClick: async () => {
        await router.push(Routes.TasksPage({ projectId: projectId }))
      },
      active: whichActive === "Tasks",
    },
    {
      icon: <RectangleStackIcon className="w-6 h-6" />,
      text: "Elements",
      onClick: async () => {
        await router.push(Routes.ElementsPage({ projectId: projectId }))
      },
      active: whichActive === "Elements",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      text: "Contributors",
      onClick: async () => {
        await router.push(Routes.ContributorsPage({ projectId: projectId }))
      },
      active: whichActive === "Contributors",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      text: "Teams",
      onClick: async () => {
        await router.push(Routes.TeamsPage({ projectId: projectId }))
      },
      active: whichActive === "Teams",
    },

    {
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      text: "Settings",
      onClick: async () => {
        await router.push(Routes.EditProjectPage({ projectId: projectId }))
      },
      active: whichActive === "Settings",
    },
  ]
}

export const HomeSidebarItems = (whichActive: string | null = null): SidebarItemProps[] => {
  const router = useRouter()

  return [
    {
      icon: <ArchiveBoxIcon className="w-6 h-6" />,
      text: "Projects",
      onClick: async () => {
        await router.push(Routes.ProjectsPage())
      },
      active: whichActive === "Projects",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      text: "Tasks",
      onClick: async () => {
        await router.push(Routes.AllTasksPage())
      },
      active: whichActive === "Tasks",
    },
  ]
}
