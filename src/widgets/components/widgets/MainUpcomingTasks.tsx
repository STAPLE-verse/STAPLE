import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetUpcomingTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const MainUpcomingTasks = () => {
  const [{ upcomingTasks }] = useQuery(getDashboardTasks, undefined)

  return (
    <Widget
      title="Upcoming Tasks"
      display={<GetUpcomingTaskDisplay upcomingTasks={upcomingTasks} />}
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" />}
      tooltipId="tool-upcoming"
      tooltipContent="Three upcoming tasks for all projects"
    />
  )
}

export default MainUpcomingTasks
