import React, { useEffect, useState } from "react"
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

  // State to hold task logs and loading state
  const [taskLogs, setTaskLogs] = useState<any[]>([]) // Adjust type based on actual data structure
  const [loading, setLoading] = useState(true)

  // Fetch tasks for the project when component mounts or currentUser changes
  useEffect(() => {
    const fetchTaskLogs = async () => {
      if (!currentUser) return // Wait for currentUser to be defined
      setLoading(true)
      try {
        // Fetch tasks for the project
        const allTaskLogs = await getLatestTaskLog(currentUser!.id)

        const taskLogs = allTaskLogs
          .filter((taskLog) => {
            return taskLog.status === Status.NOT_COMPLETED && projectId === projectId
          })
          .sort((a, b) => {
            // Sort by createdAt in descending order
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })

        setTaskLogs(taskLogs)
      } catch (error) {
        console.error("Error fetching task logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTaskLogs()
  }, [currentUser, projectId]) // Dependencies: run when currentUser or projectId changes

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
