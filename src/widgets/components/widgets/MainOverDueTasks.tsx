import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetOverdueTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const MainOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ pastDueTasks }] = useQuery(getDashboardTasks, undefined)

  return (
    <Widget
      title="Overdue Tasks"
      display={<GetOverdueTaskDisplay pastDueTasks={pastDueTasks} />}
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" />}
      tooltipId="tool-overdue"
      tooltipContent="Three overdue tasks for all projects"
      size={size}
    />
  )
}

export default MainOverdueTasks
