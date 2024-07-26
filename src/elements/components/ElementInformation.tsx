import { Routes } from "@blitzjs/next"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"
import Table from "src/core/components/Table"
import { taskElementColumns } from "src/tasks/components/TaskTable"
import getTasks from "src/tasks/queries/getTasks"
import { Element } from "@prisma/client"

interface ElementInformationProps {
  element: Element
  projectId: number | undefined
}

const ITEMS_PER_PAGE = 3

export const ElementInformation: React.FC<ElementInformationProps> = ({ element, projectId }) => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0

  // Get tasks
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      project: { id: projectId! },
      elementId: element.id,
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Events
  const goToPreviousPage = () =>
    router.push({ query: { projectId: projectId, elementId: element.id, page: page - 1 } })
  const goToNextPage = () =>
    router.push({ query: { projectId: projectId, elementId: element.id, page: page + 1 } })

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="card bg-base-300 w-1/2 mr-2">
        <div className="card-body">
          {/* Element name */}
          <div className="card-title" data-tooltip-id="element-tool">
            {element.name}
          </div>
          <Tooltip id="element-tool" content="Overall element information" className="z-[1099]" />
          {/* Element description */}
          {element.description}
          {/* Element last update */}
          <p className="italic">
            Last update:{" "}
            {element.updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // Use 24-hour format
            })}
          </p>
          {/* Show update element page */}
          <div className="card-actions justify-end">
            <Link
              className="btn btn-primary"
              href={Routes.EditElementPage({ projectId: projectId!, elementId: element.id })}
            >
              Update element
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="card bg-base-300 w-1/2">
        <div className="card-body">
          <div className="card-title" data-tooltip-id="tasks-tool">
            Tasks
          </div>
          <Tooltip id="tasks-tool" content="Tasks assigned to this element" className="z-[1099]" />
          <Table columns={taskElementColumns} data={tasks} />
          <div className="join grid grid-cols-2 mt-4">
            <button
              className="join-item btn btn-secondary"
              disabled={page === 0}
              onClick={goToPreviousPage}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-secondary"
              disabled={!hasMore}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
