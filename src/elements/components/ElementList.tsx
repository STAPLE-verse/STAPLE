import { Routes, useParam } from "@blitzjs/next"
import Link from "next/link"
import { Element, Task } from "db"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getElements from "../queries/getElements"

interface ElementsWithTasks extends Element {
  task?: Task[]
}

export const ElementsList: React.FC = ({}) => {
  // Setup
  const router = useRouter()
  const ITEMS_PER_PAGE = 7
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  // Get elements data
  const queryResult = usePaginatedQuery(getElements, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: { task: true },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Needed separate restructure to define type because of include in the query call
  const elements = queryResult[0].elements as ElementsWithTasks[]
  const { hasMore } = queryResult[0]

  return (
    <div>
      {elements.map((element) => {
        // Get tasks for the element
        const tasks = element.task

        return (
          <div className="collapse collapse-arrow bg-base-300 mb-2" key={element.id}>
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">{element.name}</div>
            <div className="collapse-content mb-4">
              <p className="mb-2">{element.description}</p>
              <p className="italic mb-2">
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
              <div className="divider">Tasks</div>
              <div className="flex flex-row bg-base-100 rounded-lg">
                {tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className="card bg-base-100 text-base-content m-2 w-1/4">
                      <div className="card-body">
                        <div className="card-title text-base-content justify-center">
                          {task.name}
                        </div>
                        {task.description && <div>{task.description.substring(0, 50)}</div>}
                      </div>
                      <div className="card-actions justify-center">
                        <Link
                          className="btn btn-secondary"
                          href={Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id })}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>There are no tasks in the element.</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Link
                  className="btn btn-primary"
                  href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}
                >
                  View Element
                </Link>
              </div>
            </div>
          </div>
        )
      })}

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
