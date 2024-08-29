import PrimaryLink from "src/core/components/PrimaryLink"
import {
  GetProjectDisplay,
  GetUpcomingTaskDisplay,
  GetOverdueTaskDisplay,
  GetNotificationDisplay,
} from "src/core/components/GetDashboardDisplay"
import { Routes } from "@blitzjs/next"
import { Widget } from "db"
import { WidgetObject } from "../hooks/useMainDashboardData"

type WidgetComponentProps = {
  widget: Widget
  projects: any[]
  notifications: any[]
  pastDueTasks: any[]
  upcomingTasks: any[]
}

export const constructWidget = ({
  widget,
  projects,
  notifications,
  pastDueTasks,
  upcomingTasks,
}: WidgetComponentProps): WidgetObject => {
  switch (widget.type) {
    case "LastProject":
      return {
        id: widget.id,
        title: "Last Updated Projects",
        display: <GetProjectDisplay projects={projects} />,
        link: <PrimaryLink route={Routes.ProjectsPage()} text="All Projects" />,
        position: widget.position,
        size: "col-span-6",
        tooltipId: "tool-last-project",
        tooltipContent: "Three recently updated projects",
      }
    case "Notifications":
      return {
        id: widget.id,
        title: "Notifications",
        display: <GetNotificationDisplay notifications={notifications} />,
        link: <PrimaryLink route={Routes.NotificationsPage()} text="All Tasks" />,
        position: widget.position,
        size: "col-span-6",
        tooltipId: "tool-notifications",
        tooltipContent: "Three recent notifications for all projects",
      }
    case "OverdueTask":
      return {
        id: widget.id,
        title: "Overdue Tasks",
        display: <GetOverdueTaskDisplay pastDueTasks={pastDueTasks} />,
        link: <PrimaryLink route={Routes.AllTasksPage()} text="All Notifications" />,
        position: widget.position,
        size: "col-span-6",
        tooltipId: "tool-overdue",
        tooltipContent: "Three overdue tasks for all projects",
      }
    case "UpcomingTask":
      return {
        id: widget.id,
        title: "Upcoming Tasks",
        display: <GetUpcomingTaskDisplay upcomingTasks={upcomingTasks} />,
        link: <PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" />,
        position: widget.position,
        size: "col-span-6",
        tooltipId: "tool-upcoming",
        tooltipContent: "Three upcoming tasks for all projects",
      }
    default:
      return {
        id: widget.id,
        title: "Unknown Widget",
        display: <div>Widget configuration error</div>,
        link: <div />,
        position: widget.position,
        size: "col-span-6",
        tooltipId: "tool-unknown",
        tooltipContent: "Unknown widget",
      }
  }
}
