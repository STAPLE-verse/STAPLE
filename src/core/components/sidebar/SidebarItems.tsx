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
import { Routes } from "@blitzjs/next"
import { ContributorPrivileges } from "db"
import { ComponentType } from "react"
import { RouteUrlObject } from "blitz"

export interface SidebarItemProps {
  icon: ComponentType<{ className?: string }>
  text: string
  route: RouteUrlObject
  alert?: boolean
  tooltipId: string
  privilege?: ContributorPrivileges[]
}

export const ProjectSidebarItems = (projectId: number): SidebarItemProps[] => {
  return [
    {
      icon: RectangleGroupIcon,
      text: "Dashboard",
      route: Routes.ShowProjectPage({ projectId: projectId }),
      tooltipId: "project-dashboard-tooltip",
      privilege: [ContributorPrivileges.CONTRIBUTOR, ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: ClipboardDocumentListIcon,
      text: "Tasks",
      route: Routes.TasksPage({ projectId: projectId }),
      tooltipId: "project-tasks-tooltip",
      privilege: [ContributorPrivileges.CONTRIBUTOR, ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: RectangleStackIcon,
      text: "Elements",
      route: Routes.ElementsPage({ projectId: projectId }),
      tooltipId: "project-elements-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: UsersIcon,
      text: "Contributors",
      route: Routes.ContributorsPage({ projectId: projectId }),
      tooltipId: "project-contributors-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: UserGroupIcon,
      text: "Teams",
      route: Routes.TeamsPage({ projectId: projectId }),
      tooltipId: "project-teams-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: DocumentChartBarIcon,
      text: "Form Data",
      route: Routes.MetadataPage({ projectId: projectId }),
      tooltipId: "project-form-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: BellIcon,
      text: "Notifications",
      route: Routes.ProjectNotificationsPage({ projectId: projectId }),
      tooltipId: "project-notification-tooltip",
      privilege: [ContributorPrivileges.CONTRIBUTOR, ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: CheckCircleIcon,
      text: "Labels",
      route: Routes.CreditPage({ projectId: projectId }),
      tooltipId: "project-credit-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
    {
      icon: NewspaperIcon,
      text: "Summary",
      route: Routes.SummaryPage({ projectId: projectId }),
      tooltipId: "project-summary-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },

    {
      icon: Cog6ToothIcon,
      text: "Settings",
      route: Routes.EditProjectPage({ projectId: projectId }),
      tooltipId: "project-settings-tooltip",
      privilege: [ContributorPrivileges.PROJECT_MANAGER],
    },
  ]
}

export const HomeSidebarItems = (): SidebarItemProps[] => {
  return [
    {
      icon: RectangleGroupIcon,
      text: "Dashboard",
      route: Routes.MainPage(),
      tooltipId: "dashboard-tooltip",
    },
    {
      icon: ArchiveBoxIcon,
      text: "Projects",
      route: Routes.ProjectsPage(),
      tooltipId: "projects-tooltip",
    },
    {
      icon: ClipboardDocumentListIcon,
      text: "Tasks",
      route: Routes.AllTasksPage(),
      tooltipId: "tasks-tooltip",
    },
    {
      icon: BellIcon,
      text: "Notifications",
      route: Routes.NotificationsPage(),
      tooltipId: "notifications-tooltip",
    },
    {
      icon: BeakerIcon,
      text: "Forms",
      route: Routes.AllFormsPage(),
      tooltipId: "forms-tooltip",
    },
    {
      icon: TagIcon,
      text: "Labels",
      route: Routes.LabelBuilderPage(),
      tooltipId: "labels-tooltip",
    },
    {
      icon: QuestionMarkCircleIcon,
      text: "Help",
      route: Routes.HelpPage(),
      tooltipId: "help-tooltip",
    },
  ]
}