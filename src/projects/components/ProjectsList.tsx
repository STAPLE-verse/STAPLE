import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import router from "next/router"
import getProjects from "src/projects/queries/getProjects"
import DateFormat from "src/core/components/DateFormat"

const ITEMS_PER_PAGE = 7

export const ProjectsList = ({ searchTerm, currentUser, page }) => {
  let where
  where = {
    AND: [
      {
        projectMembers: {
          some: {
            users: {
              some: { id: currentUser.id },
            },
            deleted: false,
          },
        },
      },
      {
        OR: [
          {
            name: {
              contains: `${searchTerm}`,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: `${searchTerm}`,
              mode: "insensitive",
            },
          },
        ],
      },
    ],
  }

  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    where: where,
    orderBy: { id: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {projects.map((project) => (
        <div className="collapse collapse-arrow bg-base-300 mb-2" key={project.id}>
          {/* Don't change this one it's not a check box */}
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">{project.name}</div>
          <div className="collapse-content mb-4">
            <p className="mb-2">{project.description}</p>
            <p className="italic mb-2">
              Last update: <DateFormat date={project.updatedAt}></DateFormat>
            </p>
            {/* TODO: Change button position by other method then using absolute */}
            <div className="justify-end absolute bottom-2 right-6">
              <Link
                className="btn btn-primary mb-2"
                href={Routes.ShowProjectPage({ projectId: project.id })}
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      ))}
      {/* Previous and next page btns */}
      <div className="join grid grid-cols-2 mt-4">
        <button
          className="join-item btn btn-secondary"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}

export default ProjectsList
