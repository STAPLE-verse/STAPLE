import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetLabelsDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const LabelsSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate label percentage
  const labelPercent =
    (projectStats.completedContribLabels + projectStats.completedTaskLabels) /
    (projectStats.allProjectMember + projectStats.allTask)

  return (
    <Widget
      title="Roles"
      display={<GetLabelsDisplay labelPercent={labelPercent} />}
      link={<PrimaryLink route={Routes.CreditPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-labels"
      tooltipContent="Percent of contributors or tasks labeled"
      size={size}
    />
  )
}

export default LabelsSummary
