import { useRouter } from "next/router"
import { useQuery, usePaginatedQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import getElement from "src/elements/queries/getElement"
import deleteElement from "src/elements/mutations/deleteElement"
import getProject from "src/projects/queries/getProject"
import getTasks from "src/tasks/queries/getTasks"
import { taskElementColumns } from "src/tasks/components/TaskTable"
import Table from "src/core/components/Table"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"

export const OverallElement = () => {
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const [element] = useQuery(getElement, { id: elementId })

  const ITEMS_PER_PAGE = 5
  const page = Number(router.query.page) || 0
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      project: { id: projectId! },
      elementId: elementId,
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="card bg-base-300 w-1/2 mr-2">
        <div className="card-body">
          <div className="card-title">{element.name}</div>
          {element.description}
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

      <div className="card bg-base-300 w-1/2">
        <div className="card-body">
          <div className="card-title">Tasks</div>
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

export const PMElement = () => {
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const [deleteElementMutation] = useMutation(deleteElement)
  const [element] = useQuery(getElement, { id: elementId })
  const projectId = useParam("projectId", "number")

  const taskPercent = 0.1
  const formPercent = 0.3
  const labelPercent = 0.5

  return (
    <div className="flex flex-row justify-center mt-2">
      <div className="card bg-base-300 w-full">
        <div className="card-body">
          <div className="card-title">PM Information</div>

          <div class="stats bg-base-300 text-lg font-bold">
            <div class="stat place-items-center">
              <div class="stat-title text-2xl text-inherit">Task Status</div>
              <div className="w-20 h-20 m-2">
                <CircularProgressbar
                  value={taskPercent * 100}
                  text={`${Math.round(taskPercent * 100)}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathTransitionDuration: "none",
                    pathColor: "oklch(var(--p))",
                    textColor: "oklch(var(--s))",
                    trailColor: "oklch(var(--pc))",
                    backgroundColor: "oklch(var(--b3))",
                  })}
                />
              </div>
              <div class="stat-desc text-lg text-inherit">Number Complete</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-2xl text-inherit">Form Data</div>
              <div className="w-20 h-20 m-2">
                <CircularProgressbar
                  value={formPercent * 100}
                  text={`${Math.round(formPercent * 100)}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathTransitionDuration: "none",
                    pathColor: "oklch(var(--p))",
                    textColor: "oklch(var(--s))",
                    trailColor: "oklch(var(--pc))",
                    backgroundColor: "oklch(var(--b3))",
                  })}
                />
              </div>
              <div class="stat-desc text-lg text-inherit">Number Complete</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-2xl text-inherit">Labels</div>
              <div className="w-20 h-20 m-2">
                <CircularProgressbar
                  value={labelPercent * 100}
                  text={`${Math.round(labelPercent * 100)}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathTransitionDuration: "none",
                    pathColor: "oklch(var(--p))",
                    textColor: "oklch(var(--s))",
                    trailColor: "oklch(var(--pc))",
                    backgroundColor: "oklch(var(--b3))",
                  })}
                />
              </div>
              <div class="stat-desc text-lg text-inherit">Number Completed</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-2xl text-inherit">Delete Element</div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={async () => {
                  if (window.confirm("This element will be deleted. Is that ok?")) {
                    await deleteElementMutation({ id: element.id })
                    await router.push(Routes.ElementsPage({ projectId: projectId! }))
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
