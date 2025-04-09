import React from "react"
import TooltipWrapper from "../TooltipWrapper"

const tooltipContents = [
  { id: "project-dashboard-tooltip", content: "Project dashboard" },
  { id: "project-tasks-tooltip", content: "Project tasks" },
  { id: "project-elements-tooltip", content: "Group and track tasks" },
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
  { id: "dashboard-tooltip", content: "Home dashboard" },
  { id: "projects-tooltip", content: "View all projects" },
  { id: "tasks-tooltip", content: "View all tasks" },
  { id: "forms-tooltip", content: "Manage metadata forms" },
  { id: "notifications-tooltip", content: "View all notifications" },
  { id: "roles-tooltip", content: "Manage role categories" },
  { id: "help-tooltip", content: "Get help" },
  { id: "project-notification-tooltip", content: "Project notifications" },
  { id: "invite-tooltip", content: "Project invitations" },
]

const SidebarTooltips = () => {
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
