import React from "react"
import { useParam } from "@blitzjs/next"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"
import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { TaskLogWithTask } from "src/core/types"
import { projectTaskColumns } from "../ColumnHelpers"

const ProjectUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // get TaskLogs for this project and user
  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      task: { projectId: projectId },
      assignedTo: { users: { some: { id: currentUser?.id } } },
    },
    include: { task: true }, // Include the task relation
  })
  // deal with typing
  const typedTaskLogs = taskLogs as TaskLogWithTask[]
  // get latest log for each task
  const latestLog = getLatestTaskLogs(typedTaskLogs)

  // Filter for upcoming tasks
  const today = moment().startOf("day")
  const upcomingTasks = latestLog
    .filter((taskLog) => {
      if (taskLog && taskLog.task.deadline) {
        return moment(taskLog.task.deadline).isSameOrAfter(today, "day")
      }
      return false
    })
    .sort((a, b) => {
      // Sort by createdAt in descending order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 3) // top three rows

  return (
    <Widget
      title="Upcoming Tasks"
      display={
        <GetTableDisplay
          data={upcomingTasks.slice(0, 3)}
          columns={projectTaskColumns}
          type={"upcoming tasks"}
        />
      }
      link={
        <PrimaryLink
          route={Routes.TasksPage({
            projectId: projectId!,
          })}
          text="All Tasks"
          classNames="btn-primary"
        />
      }
      tooltipId="tool-upcoming"
      tooltipContent="Three upcoming tasks for this project"
      size={size}
    />
  )
}

export default ProjectUpcomingTasks
