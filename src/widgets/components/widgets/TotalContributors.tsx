import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjects from "src/projects/queries/getProjects"
import { ProjectWithMembers } from "src/core/types"

const TotalContributors: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()

  // Get projects with project members and users
  const [{ projects }] = useQuery<typeof getProjects, { projects: ProjectWithMembers[] }>(
    getProjects,
    {
      where: {
        projectMembers: {
          some: {
            users: { some: { id: currentUser?.id } },
            deleted: false,
            name: null,
          },
        },
      },
      include: {
        projectMembers: {
          include: {
            users: true,
          },
        },
      },
    }
  )

  // Collect all unique user IDs from projectMembers
  const uniqueUserIds = new Set(
    projects.flatMap((project) =>
      project.projectMembers.flatMap((member) => member.users.map((user) => user.id))
    )
  )

  return (
    <Widget
      title="Total Contributors"
      display={<GetIconDisplay number={uniqueUserIds.size} icon={UsersIcon} />}
      link={
        <PrimaryLink
          route={Routes.InvitesPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-contributors-total"
      tooltipContent="Total number of unique contributors across all projects"
      size={size}
    />
  )
}

export default TotalContributors
