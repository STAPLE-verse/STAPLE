import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTotalTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const TaskTotal: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate task completion percentage
  const taskPercent =
    projectStats.allTask === 0 ? 0 : projectStats.completedTask / projectStats.allTask

  return (
    <Widget
      title="Tasks"
      display={<GetTotalTaskDisplay taskPercent={taskPercent} />}
      link={<PrimaryLink route={Routes.TasksPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-tasks"
      tooltipContent="Percent of tasks completed"
      size={size}
    />
  )
}

export default TaskTotal
