import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetUpcomingTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const MainUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  const [{ upcomingTasks }] = useQuery(getDashboardTasks, ctx, {
    suspense: true, // Set to false if you want to handle loading and error states manually
  })

  return (
    <Widget
      title="Upcoming Tasks"
      display={<GetUpcomingTaskDisplay upcomingTasks={upcomingTasks} />}
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" classNames="btn-primary" />}
      tooltipId="tool-upcoming"
      tooltipContent="Three upcoming tasks for all projects"
      size={size}
    />
  )
}

export default MainUpcomingTasks
