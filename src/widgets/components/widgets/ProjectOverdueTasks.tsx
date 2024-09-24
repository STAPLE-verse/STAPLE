import React, { useEffect, useState } from "react"
import { useParam } from "@blitzjs/next"
import { Status, Task, TaskLog } from "db"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectOverdueTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"
import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"

type TaskLogWithTask = TaskLog & {
  task: Task
}

const ProjectOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
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
  const typedTaskLogs = taskLogs as TaskLogWithTask[]

  // get latest log for each task
  const latestLog = getLatestTaskLogs(typedTaskLogs)

  // Filter for overdue tasks, incomplete, then sort
  const pastDueTasks = latestLog
    .filter((taskLog) => {
      if (taskLog && taskLog.task.deadline && taskLog.status === Status.NOT_COMPLETED) {
        return moment(taskLog.task.deadline).isBefore(moment(), "minute")
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
      tooltipContent="Three recent overdue tasks for this project"
      size={size}
    />
  )
}

export default ProjectOverdueTasks
