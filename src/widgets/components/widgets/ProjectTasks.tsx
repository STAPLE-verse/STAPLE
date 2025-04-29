import React, { FC } from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MemberPrivileges } from "@prisma/client"
import getTaskStats from "src/tasks/queries/getTaskStats"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface TaskTotalType
  extends FC<{ size: "SMALL" | "MEDIUM" | "LARGE"; privilege: MemberPrivileges }> {
  requiresPrivilege?: boolean
}

const TaskTotal: TaskTotalType = ({ size, privilege }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [taskStats] = useQuery(getTaskStats, { projectId: projectId!, privilege: privilege })

  // Calculate task completion percentage
  const taskProportion = taskStats.allTask === 0 ? 0 : taskStats.completedTask / taskStats.allTask

  return (
    <Widget
      title="Tasks"
      display={<GetCircularProgressDisplay proportion={taskProportion} />}
      link={
        <PrimaryLink
          route={Routes.TasksPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-tasks"
      tooltipContent="Percent of tasks completed and number of new comments"
      size={size}
      newCommentsCount={taskStats.newCommentsCount}
    />
  )
}

// TODO: Not an ideal solution, replace it with something more generalized
TaskTotal.requiresPrivilege = true

export default TaskTotal
