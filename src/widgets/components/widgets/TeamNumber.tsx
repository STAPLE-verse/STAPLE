import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTeamDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const TeamNumber: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats for the teams
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Teams"
      display={<GetTeamDisplay projectStats={projectStats} />}
      link={<PrimaryLink route={Routes.TeamsPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-teams"
      tooltipContent="Total number of teams"
      size={size}
    />
  )
}

export default TeamNumber
