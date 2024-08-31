import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import { TaskStatus } from "db"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectUpcomingTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"

const ProjectUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Fetch tasks for the project
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      status: TaskStatus.NOT_COMPLETED,
      projectId: projectId,
    },
    orderBy: { id: "desc" },
  })

  // Filter for upcoming tasks
  const today = moment().startOf("day")
  const upcomingTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSameOrAfter(today, "day")
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
