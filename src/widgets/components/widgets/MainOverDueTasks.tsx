import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetOverdueTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const MainOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  const [{ taskLogs, upcomingTasks, pastDueTasks }, { error }] = useQuery(getDashboardTasks, ctx, {
    suspense: true, // Set to false if you want to handle loading and error states manually
  })

  return (
    <Widget
      title="Overdue Tasks"
      display={<GetOverdueTaskDisplay pastDueTasks={pastDueTasks} />}
      link={<PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" classNames="btn-primary" />}
      tooltipId="tool-overdue"
      tooltipContent="Three overdue tasks for all projects"
      size={size}
    />
  )
}

export default MainOverdueTasks
