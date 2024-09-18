import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import { Status, TaskLog } from "db"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectOverdueTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"
import { getLatestTaskLog } from "src/tasklogs/utils/getLatestTaskLog"
import { Ctx } from "blitz"

const ProjectOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = async (
  { size },
  ctx
) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Fetch tasks for the project
  const alltaskLogs = await getLatestTaskLog(currentUser!.id, ctx)

  const taskLogs = (alltaskLogs as TaskLog[])
    .filter((taskLog) => {
      return taskLog.status === Status.NOT_COMPLETED && projectId === projectId
    })
    .sort((a, b) => {
      // Sort by createdAt in descending order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  // Filter for overdue tasks
  const pastDueTasks = taskLogs.filter((taskLog) => {
    if (taskLog && taskLog.task.deadline) {
      return moment(taskLog.task.deadline).isBefore(moment(), "minute")
    }
    return false
  })

  return (
    <Widget
      title="Overdue Tasks"
      display={<GetProjectOverdueTaskDisplay pastDueTasks={pastDueTasks} />}
      link={
        <PrimaryLink
          route={Routes.TasksPage({
            projectId: projectId!,
          })}
          text="All Tasks"
        />
      }
      tooltipId="tool-overdue"
      tooltipContent="Three overdue tasks for this project"
      size={size}
    />
  )
}

export default ProjectOverdueTasks
