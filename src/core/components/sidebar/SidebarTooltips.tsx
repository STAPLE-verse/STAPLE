import React from "react"
import { Tooltip } from "react-tooltip"

const tooltipContents = [
  { id: "project-home-tooltip", content: "Go back home to all projects" },

  { id: "project-dashboard-tooltip", content: "See overall project information dashboard" },
  { id: "project-tasks-tooltip", content: "View, add, edit, and complete project specific tasks" },
  { id: "project-elements-tooltip", content: "Elements help you organize tasks into buckets" },
  {
    id: "project-projectMembers-tooltip",
    content: "Add, edit, and view all people on the project",
  },
  { id: "project-teams-tooltip", content: "Add, edit, and view project teams" },
  {
    id: "project-credit-tooltip",
    content: "Add, edit, and view contribution explanations with roles",
  },
  { id: "project-form-tooltip", content: "Review and download project form data (metadata)" },
  { id: "project-summary-tooltip", content: "Review and download project summary (metadata)" },
  {
    id: "project-settings-tooltip",
    content: "Add, edit, and view project overview information (metadata)",
  },
  { id: "dashboard-tooltip", content: "View the home page dashboard for all projects" },
  { id: "projects-tooltip", content: "View all projects and open a specific one" },
  { id: "tasks-tooltip", content: "View all tasks for all projects" },
  { id: "forms-tooltip", content: "Build your own forms to collect data in a task (metadata)" },
  { id: "notifications-tooltip", content: "View all notifications for projects" },
  { id: "roles-tooltip", content: "View, add, and edit contribution categories with roles" },
  { id: "help-tooltip", content: "Get help with STAPLE" },
  { id: "project-notification-tooltip", content: "View notifications for this project" },
  { id: "invite-tooltip", content: "View and accept project invitations" },
]

const SidebarTooltips = () => {
  return (
    <>
      {tooltipContents.map((tooltip) => (
        <Tooltip
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
