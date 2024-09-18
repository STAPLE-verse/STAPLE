import React from "react"
import { useParam } from "@blitzjs/next"
import { Status, TaskLog } from "db"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectUpcomingTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"
import { getLatestTaskLog } from "src/tasklogs/utils/getLatestTaskLog"

const ProjectUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Fetch tasks for the project
  const alltaskLogs = getLatestTaskLog(currentUser!.id, ctx)

  const taskLogs = (alltaskLogs as unknown as TaskLog[])
    .filter((taskLog) => {
      return taskLog.status === Status.NOT_COMPLETED && projectId === projectId
    })
    .sort((a, b) => {
      // Sort by createdAt in descending order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  // Filter for upcoming tasks
  const today = moment().startOf("day")
  const upcomingTasks = taskLogs.filter((taskLog) => {
    if (taskLog && taskLog.task.deadline) {
      return moment(taskLog.task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  return (
    <Widget
      title="Upcoming Tasks"
      display={<GetProjectUpcomingTaskDisplay upcomingTasks={upcomingTasks} />}
      link={
        <PrimaryLink
          route={Routes.TasksPage({
            projectId: projectId!,
          })}
          text="All Tasks"
        />
      }
      tooltipId="tool-upcoming"
      tooltipContent="Three upcoming tasks for this project"
      size={size}
    />
  )
}

export default ProjectUpcomingTasks
