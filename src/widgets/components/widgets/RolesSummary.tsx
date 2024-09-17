import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetRolesDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const RolesSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate role percentage
  const rolePercent =
    (projectStats.completedContribRoles + projectStats.completedTaskRoles) /
    (projectStats.allProjectMember + projectStats.allTask)

  return (
    <Widget
      title="Roles"
      display={<GetRolesDisplay rolePercent={rolePercent} />}
      link={<PrimaryLink route={Routes.CreditPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-roles"
      tooltipContent="Percent of project members or tasks with roles"
      size={size}
    />
  )
}

export default RolesSummary
