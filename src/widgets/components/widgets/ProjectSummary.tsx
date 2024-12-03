import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import getProject from "src/projects/queries/getProject"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectSummaryDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MemberPrivileges } from "db"

const ProjectSummary: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  const [project] = useQuery(getProject, { id: projectId })

  const [projectManagers] = useQuery(getProjectManagers, {
    projectId: projectId!,
    include: {
      user: true,
    },
  })

  return (
    <Widget
      title={project.name}
      display={<GetProjectSummaryDisplay project={project} projectManagers={projectManagers} />}
      link={
        privilege === MemberPrivileges.PROJECT_MANAGER ? (
          <PrimaryLink
            route={Routes.EditProjectPage({ projectId: project.id })}
            text="Edit Project"
            classNames="btn-primary"
          />
        ) : null
      }
      tooltipId="tool-project"
      tooltipContent="Overall project information"
      size={size}
    />
  )
}

export default ProjectSummary
