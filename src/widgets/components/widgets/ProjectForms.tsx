import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const FormNumber: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate form completion percentage
  const formProportion =
    projectStats.allTaskLogs === 0 ? 0 : projectStats.completedTaskLogs / projectStats.allTaskLogs

  return (
    <Widget
      title="Forms"
      display={<GetCircularProgressDisplay proportion={formProportion} />}
      link={
        <PrimaryLink
          route={Routes.MetadataPage({ projectId: projectId! })}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-forms"
      tooltipContent="Percent of forms completed"
      size={size}
    />
  )
}

export default FormNumber
