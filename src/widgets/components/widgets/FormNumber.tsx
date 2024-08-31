import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetFormDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const FormNumber = () => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // Calculate form completion percentage
  const formPercent =
    projectStats.allAssignments === 0
      ? 0
      : projectStats.completedAssignments / projectStats.allAssignments

  return (
    <Widget
      title="Forms"
      display={<GetFormDisplay formPercent={formPercent} />}
      link={<PrimaryLink route={Routes.MetadataPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-forms"
      tooltipContent="Percent of forms completed"
    />
  )
}

export default FormNumber
