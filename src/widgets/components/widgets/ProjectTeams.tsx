import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { UserGroupIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const TeamNumber: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats for the teams
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Teams"
      display={<GetIconDisplay number={projectStats.allTeams} icon={UserGroupIcon} />}
      link={
        <PrimaryLink
          route={Routes.TeamsPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-teams"
      tooltipContent="Total number of teams"
      size={size}
    />
  )
}

export default TeamNumber
