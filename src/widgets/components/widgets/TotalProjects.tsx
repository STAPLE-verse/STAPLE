import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetProjectTotalDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjects from "src/projects/queries/getProjects"

const TotalProjects: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()
  const [{ projects }] = useQuery(getProjects, {
    where: {
      projectMembers: {
        some: {
          users: { some: { id: currentUser?.id } },
          deleted: false,
          name: null,
        },
      },
    },
  })

  return (
    <Widget
      title="Projects"
      display={<GetProjectTotalDisplay projects={projects} />}
      link={
        <PrimaryLink
          route={Routes.ProjectsPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-project-total"
      tooltipContent="Total number of projects"
      size={size}
    />
  )
}

export default TotalProjects
