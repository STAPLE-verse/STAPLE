import React, { FC } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { TaskLogWithTaskAndProject } from "src/core/types"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { processAllTasks } from "src/tasks/tables/processing/processAllTasks"

const AllTaskTotal: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()

  // Fetch all tasks
  // Get latest logs that this user is involved in
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedTo: {
        users: { some: { id: currentUser?.id } },
        deleted: false,
      },
    },
    include: {
      task: {
        include: {
          project: true, // Include the project linked to the task
        },
      },
    },
    orderBy: { id: "asc" },
  })

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTaskAndProject[] = (fetchedTaskLogs ??
    []) as TaskLogWithTaskAndProject[]

  // process those logs to get the latest one for each task-projectmemberId
  const latestLogs = getLatestTaskLogs<TaskLogWithTaskAndProject>(taskLogs)

  const processedTasks = processAllTasks(latestLogs)

  // Calculate task completion percentage
  // need to sum this up
  const totalCompletion = processedTasks.reduce((sum, task) => sum + task.completion, 0)
  // divide by 100 because this is a percent for that table
  const taskProportion =
    processedTasks.length > 0 ? totalCompletion / 100 / processedTasks.length : 0

  console.log(processedTasks)

  return (
    <Widget
      title="Tasks"
      display={<GetCircularProgressDisplay proportion={taskProportion} />}
      link={
        <PrimaryLink
          route={Routes.AllTasksPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-tasks"
      tooltipContent="Percent of tasks completed"
      size={size}
    />
  )
}

export default AllTaskTotal
