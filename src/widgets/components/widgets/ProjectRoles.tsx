import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const RolesSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate role percentage
  const roleProportion =
    (projectStats.completedContribRoles + projectStats.completedTaskRoles) /
    (projectStats.allProjectMember + projectStats.allTask)

  return (
    <Widget
      title="Roles"
      display={<GetCircularProgressDisplay proportion={roleProportion} />}
      link={
        <PrimaryLink
          route={Routes.RolesPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-roles"
      tooltipContent="Percent of project members or tasks with roles"
      size={size}
    />
  )
}

export default RolesSummary
