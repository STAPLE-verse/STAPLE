import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { tasksColumns } from "../ColumnHelpers"

const MainOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  const [{ pastDueTasks }] = useQuery(getDashboardTasks, ctx, {
    suspense: true, // Set to false if you want to handle loading and error states manually
  })

  return (
    <Widget
      title="Overdue Tasks"
      display={
        <GetTableDisplay data={pastDueTasks} columns={tasksColumns} type={"overdue tasks"} />
      }
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" classNames="btn-primary" />}
      tooltipId="tool-overdue"
      tooltipContent="Three overdue tasks for all projects"
      size={size}
    />
  )
}

export default MainOverdueTasks
