import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon, FlagIcon } from "@heroicons/react/24/outline"

const MilestoneSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Milestones"
      display={<GetIconDisplay number={projectStats.allMilestones} icon={FlagIcon} />}
      link={
        <PrimaryLink
          route={Routes.MilestonesPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-milestone"
      tooltipContent="Number of milestones for this project"
      size={size}
    />
  )
}

export default MilestoneSummary
