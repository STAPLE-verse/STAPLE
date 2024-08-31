import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetElementDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const ElementSummary = () => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Elements"
      display={<GetElementDisplay projectStats={projectStats} />}
      link={<PrimaryLink route={Routes.ElementsPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-element"
      tooltipContent="Number of elements for this project"
    />
  )
}

export default ElementSummary
