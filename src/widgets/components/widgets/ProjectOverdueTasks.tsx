import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import { Status } from "db"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectOverdueTaskDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import moment from "moment"

const ProjectOverdueTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
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
      status: Status.NOT_COMPLETED,
      projectId: projectId,
    },
    orderBy: { id: "desc" },
  })

  // Filter for overdue tasks
  const pastDueTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isBefore(moment(), "minute")
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
