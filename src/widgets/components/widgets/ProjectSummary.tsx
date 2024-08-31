import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getContributors from "src/contributors/queries/getContributors"
import getProject from "src/projects/queries/getProject"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectSummaryDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const ProjectSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const projectId = useParam("projectId", "number")

  const [project] = useQuery(getProject, { id: projectId })

  const [{ contributors: projectManagers }] = useQuery(getContributors, {
    where: {
      projectId: projectId,
      privilege: "PROJECT_MANAGER",
    },
    include: {
      user: true,
    },
  })

  return (
    <Widget
      title={project.name}
      display={<GetProjectSummaryDisplay project={project} projectManagers={projectManagers} />}
      link={
        <PrimaryLink
          route={Routes.EditProjectPage({ projectId: project.id })}
          text="Edit Project"
        />
      }
      tooltipId="tool-project"
      tooltipContent="Overall project information"
      size={size}
    />
  )
}

export default ProjectSummary
