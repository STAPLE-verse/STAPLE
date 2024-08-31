import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getProjectStats from "src/projects/queries/getProjectStats"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetContributorDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const ContributorNumber = () => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")

  // Fetch project stats for the contributors
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  return (
    <Widget
      title="Contributors"
      display={<GetContributorDisplay projectStats={projectStats} />}
      link={<PrimaryLink route={Routes.ContributorsPage({ projectId: projectId! })} text="View" />}
      tooltipId="tool-contributors"
      tooltipContent="Total number of contributors"
      // size="col-span-2"
    />
  )
}

export default ContributorNumber
