import { usePaginatedQuery } from "@blitzjs/rpc"
import getProjects from "src/projects/queries/getProjects"
import ProjectCard from "./ProjectCard"
import PaginationControls from "src/core/components/PaginationControls"
import { Prisma } from "@prisma/client"
import router from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 7

export const ProjectsList = ({ searchTerm }) => {
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  const where: Prisma.ProjectWhereInput = {
    AND: [
      {
        projectMembers: {
          some: {
            users: { some: { id: currentUser?.id } },
            deleted: false,
            name: null,
          },
        },
      },
      {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },
    ],
  }

  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    where: where,
    include: currentUser?.id
      ? {
          ProjectPrivilege: {
            where: { userId: currentUser.id },
            select: { userId: true, privilege: true },
          },
        }
      : {
          ProjectPrivilege: {
            select: { userId: true, privilege: true },
          },
        },
    orderBy: { id: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <ProjectCard project={project} />
        </div>
      ))}
      {/* Previous and next page btns */}
      <PaginationControls page={page} hasMore={hasMore} />
    </div>
  )
}

export default ProjectsList
