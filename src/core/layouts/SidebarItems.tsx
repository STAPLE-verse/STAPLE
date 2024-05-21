import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  UsersIcon,
  UserGroupIcon,
  BeakerIcon,
  BellIcon,
  DocumentChartBarIcon,
  NewspaperIcon,
  TagIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/router"
import { SidebarItemProps } from "../components/Sidebar"
import { Routes } from "@blitzjs/next"
import { Tooltip } from "react-tooltip"

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
      tooltipId: "project-dashboard-tooltip",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      text: "Tasks",
      onClick: async () => {
        await router.push(Routes.TasksPage({ projectId: projectId }))
      },
      active: whichActive === "Tasks",
      tooltipId: "project-tasks-tooltip",
    },
    {
      icon: <RectangleStackIcon className="w-6 h-6" />,
      text: "Elements",
      onClick: async () => {
        await router.push(Routes.ElementsPage({ projectId: projectId }))
      },
      active: whichActive === "Elements",
      tooltipId: "project-elements-tooltip",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      text: "Contributors",
      onClick: async () => {
        await router.push(Routes.ContributorsPage({ projectId: projectId }))
      },
      active: whichActive === "Contributors",
      tooltipId: "project-contributors-tooltip",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      text: "Teams",
      onClick: async () => {
        await router.push(Routes.TeamsPage({ projectId: projectId }))
      },
      active: whichActive === "Teams",
      tooltipId: "project-teams-tooltip",
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      text: "Labels",
      onClick: async () => {
        await router.push(Routes.CreditPage({ projectId: projectId }))
      },
      active: whichActive === "Credit",
      tooltipId: "project-credit-tooltip",
    },
    {
      icon: <DocumentChartBarIcon className="w-6 h-6" />,
      text: "Form Data",
      onClick: async () => {
        await router.push(Routes.MetadataPage({ projectId: projectId }))
      },
      active: whichActive === "Form Data",
      tooltipId: "project-form-tooltip",
    },

    {
      icon: <NewspaperIcon className="w-6 h-6" />,
      text: "Summary",
      onClick: async () => {
        await router.push(Routes.SummaryPage({ projectId: projectId }))
      },
      active: whichActive === "Summary",
      tooltipId: "project-summary-tooltip",
    },

    {
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      text: "Settings",
      onClick: async () => {
        await router.push(Routes.EditProjectPage({ projectId: projectId }))
      },
      active: whichActive === "Settings",
      tooltipId: "project-settings-tooltip",
    },
  ]
}

export const HomeSidebarItems = (whichActive: string | null = null): SidebarItemProps[] => {
  const router = useRouter()

  return [
    {
      icon: <RectangleGroupIcon className="w-6 h-6" />,
      text: "Dashboard",
      onClick: async () => {
        await router.push(Routes.MainPage())
      },
      active: whichActive === "Dashboard",
      tooltipId: "dashboard-tooltip",
    },
    {
      icon: <ArchiveBoxIcon className="w-6 h-6" />,
      text: "Projects",
      onClick: async () => {
        await router.push(Routes.ProjectsPage())
      },
      active: whichActive === "Projects",
      tooltipId: "projects-tooltip",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      text: "Tasks",
      onClick: async () => {
        await router.push(Routes.AllTasksPage())
      },
      active: whichActive === "Tasks",
      tooltipId: "tasks-tooltip",
    },
    {
      icon: <BeakerIcon className="w-6 h-6" />,
      text: "Forms",
      onClick: async () => {
        await router.push(Routes.AllFormsPage())
      },
      active: whichActive === "Forms",
      tooltipId: "forms-tooltip",
    },
    {
      icon: <BellIcon className="w-6 h-6" />,
      text: "Notifications",
      onClick: async () => {
        await router.push(Routes.NotificationsPage())
      },
      active: whichActive === "Notifications",
      tooltipId: "notifications-tooltip",
    },
    {
      icon: <TagIcon className="w-6 h-6" />,
      text: "Labels",
      onClick: async () => {
        await router.push(Routes.LabelBuilderPage())
      },
      active: whichActive === "Labels",
      tooltipId: "labels-tooltip",
    },
    {
      icon: <QuestionMarkCircleIcon className="w-6 h-6" />,
      text: "Help",
      onClick: async () => {
        await router.push(Routes.HelpPage())
      },
      active: whichActive === "Help",
      tooltipId: "help-tooltip",
    },
  ]
}
