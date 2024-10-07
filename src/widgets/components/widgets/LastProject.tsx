import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import Widget from "../Widget"
import { GetProjectDisplay } from "src/core/components/GetWidgetDisplay"

const LastProject: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ projects }] = useQuery(getDashboardProjects, undefined)

  return (
    <Widget
      title="Last Updated Projects"
      display={<GetProjectDisplay projects={projects} />}
      link={
        <PrimaryLink route={Routes.ProjectsPage()} text="All Projects" classNames="btn-primary" />
      }
      tooltipId="tool-last-project"
      tooltipContent="Three recently updated projects"
      size={size}
    />
  )
}

export default LastProject
