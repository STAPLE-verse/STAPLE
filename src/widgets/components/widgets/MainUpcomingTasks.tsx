import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { tasksColumns } from "../ColumnHelpers"

const MainUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  const [{ upcomingTasks }] = useQuery(getDashboardTasks, ctx, {
    suspense: true, // Set to false if you want to handle loading and error states manually
  })

  return (
    <Widget
      title="Upcoming Tasks"
      display={
        <GetTableDisplay data={upcomingTasks} columns={tasksColumns} type={"upcoming tasks"} />
      }
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" classNames="btn-primary" />}
      tooltipId="tool-upcoming"
      tooltipContent="Three upcoming tasks for all projects"
      size={size}
    />
  )
}

export default MainUpcomingTasks
