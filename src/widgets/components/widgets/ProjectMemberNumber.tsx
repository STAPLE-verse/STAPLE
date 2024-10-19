import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectMemberDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const ProjectMemberNumber: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats for the projectMembers
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Contributors"
      display={<GetProjectMemberDisplay projectStats={projectStats} />}
      link={
        <PrimaryLink
          route={Routes.ContributorsPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-projectmembers"
      tooltipContent="Total number of contributors"
      size={size}
    />
  )
}

export default ProjectMemberNumber
