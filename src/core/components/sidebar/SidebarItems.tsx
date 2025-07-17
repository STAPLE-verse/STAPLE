import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  FlagIcon,
  UsersIcon,
  UserGroupIcon,
  BeakerIcon,
  BellIcon,
  DocumentChartBarIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  WrenchIcon,
  FingerPrintIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline"
import { Routes } from "@blitzjs/next"
import { MemberPrivileges } from "db"
import { ComponentType } from "react"
import { RouteUrlObject } from "blitz"
import type { TFunction } from "i18next"

export interface SidebarItemProps {
  icon: ComponentType<{ className?: string }>
  text: string
  route: RouteUrlObject
  alert?: boolean
  tooltipId: string
  privilege?: MemberPrivileges[]
  userPrivilege?: string[]
}

export const ProjectSidebarItems = (projectId: number, t: TFunction): SidebarItemProps[] => {
  return [
    {
      icon: RectangleGroupIcon,
      text: t("sidebar.project.dashboard"),
      route: Routes.ShowProjectPage({ projectId: projectId }),
      tooltipId: "project-dashboard-tooltip",
      privilege: [MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: SwatchIcon,
      text: t("sidebar.project.tags"),
      route: Routes.TagsPage({ projectId: projectId }),
      tooltipId: "project-tags-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: FlagIcon,
      text: t("sidebar.project.milestones"),
      route: Routes.MilestonesPage({ projectId: projectId }),
      tooltipId: "project-milestones-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: ClipboardDocumentListIcon,
      text: t("sidebar.project.tasks"),
      route: Routes.TasksPage({ projectId: projectId }),
      tooltipId: "project-tasks-tooltip",
      privilege: [MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: UsersIcon,
      text: t("sidebar.project.contributors"),
      route: Routes.ContributorsPage({ projectId: projectId }),
      tooltipId: "project-projectMembers-tooltip",
      privilege: [MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: UserGroupIcon,
      text: t("sidebar.project.teams"),
      route: Routes.TeamsPage({ projectId: projectId }),
      tooltipId: "project-teams-tooltip",
      privilege: [MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: DocumentChartBarIcon,
      text: t("sidebar.project.formData"),
      route: Routes.MetadataPage({ projectId: projectId }),
      tooltipId: "project-form-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: BellIcon,
      text: t("sidebar.project.notifications"),
      route: Routes.ProjectNotificationsPage({ projectId: projectId }),
      tooltipId: "project-notification-tooltip",
      privilege: [MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: FingerPrintIcon,
      text: t("sidebar.project.roles"),
      route: Routes.RolesPage({ projectId: projectId }),
      tooltipId: "project-credit-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: NewspaperIcon,
      text: t("sidebar.project.summary"),
      route: Routes.SummaryPage({ projectId: projectId }),
      tooltipId: "project-summary-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
    {
      icon: Cog6ToothIcon,
      text: t("sidebar.project.settings"),
      route: Routes.EditProjectPage({ projectId: projectId }),
      tooltipId: "project-settings-tooltip",
      privilege: [MemberPrivileges.PROJECT_MANAGER],
    },
  ]
}

export const HomeSidebarItems = (t: TFunction): SidebarItemProps[] => {
  return [
    {
      icon: RectangleGroupIcon,
      text: t("sidebar.home.dashboard"),
      route: Routes.MainPage(),
      tooltipId: "dashboard-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: ArchiveBoxIcon,
      text: t("sidebar.home.projects"),
      route: Routes.ProjectsPage(),
      tooltipId: "projects-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: EnvelopeIcon,
      text: t("sidebar.home.invitations"),
      route: Routes.InvitesPage(),
      tooltipId: "invite-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: ClipboardDocumentListIcon,
      text: t("sidebar.home.tasks"),
      route: Routes.AllTasksPage(),
      tooltipId: "tasks-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: BellIcon,
      text: t("sidebar.home.notifications"),
      route: Routes.NotificationsPage(),
      tooltipId: "notifications-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: BeakerIcon,
      text: t("sidebar.home.forms"),
      route: Routes.AllFormsPage(),
      tooltipId: "forms-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: FingerPrintIcon,
      text: t("sidebar.home.roles"),
      route: Routes.RoleBuilderPage(),
      tooltipId: "roles-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
    {
      icon: WrenchIcon,
      text: t("sidebar.home.admin"),
      route: Routes.UpdatesPage(),
      tooltipId: "help-tooltip",
      userPrivilege: ["ADMIN"],
    },
    {
      icon: QuestionMarkCircleIcon,
      text: t("sidebar.home.help"),
      route: Routes.HelpPage(),
      tooltipId: "help-tooltip",
      userPrivilege: ["USER", "ADMIN"],
    },
  ]
}
