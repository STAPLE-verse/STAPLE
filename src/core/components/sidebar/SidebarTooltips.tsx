import React from "react"
import TooltipWrapper from "../TooltipWrapper"
import { useTranslation } from "react-i18next"

const SidebarTooltips = () => {
  const { t } = (useTranslation as any)()
  const tooltipContents = [
    { id: "project-dashboard-tooltip", content: "Project dashboard" },
    { id: "project-tasks-tooltip", content: "Project tasks" },
    { id: "project-milestones-tooltip", content: "Group and track tasks" },
    {
      id: "project-projectMembers-tooltip",
      content: "Manage project members",
    },
    { id: "project-teams-tooltip", content: "Manage project teams" },
    {
      id: "project-credit-tooltip",
      content: "Manage project roles",
    },
    { id: "project-form-tooltip", content: "Manage project form metadata" },
    { id: "project-summary-tooltip", content: "View project summary" },
    {
      id: "project-settings-tooltip",
      content: "Manage project settings",
    },
    { id: "dashboard-tooltip", content: t("sidebar.home.tooltips.dashboard") },
    { id: "projects-tooltip", content: t("sidebar.home.tooltips.projects") },
    { id: "tasks-tooltip", content: t("sidebar.home.tooltips.tasks") },
    { id: "forms-tooltip", content: t("sidebar.home.tooltips.forms") },
    { id: "notifications-tooltip", content: t("sidebar.home.tooltips.notifications") },
    { id: "roles-tooltip", content: t("sidebar.home.tooltips.roles") },
    { id: "help-tooltip", content: t("sidebar.home.tooltips.help") },
    { id: "project-notification-tooltip", content: "Project notifications" },
    { id: "invite-tooltip", content: t("sidebar.home.tooltips.invitations") },
    { id: "project-notes-tooltip", content: "View notes" },
    { id: "project-tags-tooltip", content: "View tag dashboard" },
  ]

  return (
    <>
      {tooltipContents.map((tooltip) => (
        <TooltipWrapper
          key={tooltip.id}
          id={tooltip.id}
          content={tooltip.content}
          className="z-[1099] ourtooltips"
          place="right"
        />
      ))}
    </>
  )
}

export default SidebarTooltips
