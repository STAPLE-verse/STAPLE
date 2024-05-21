import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import { taskTableColumns } from "src/tasks/components/TaskTable"
import TaskBoard from "src/tasks/components/TaskBoard"
import Table from "src/core/components/Table"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

// TODO: The number of items per page will affect the number of tasks shown in the table
const ITEMS_PER_PAGE = 10

export const ProjectTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          <Tab
            className={({ selected }) =>
              classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
            }
          >
            Board
          </Tab>
          {/* TabLink for table view */}
          <Tab
            className={({ selected }) =>
              classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
            }
          >
            Table
          </Tab>
          {/* TODO: First click on board does not change it after init */}
        </Tab.List>

        <Tab.Panels>
          {/* Tabpanel for kanban board */}
          <Tab.Panel>
            <TaskBoard projectId={projectId!} />
          </Tab.Panel>
          {/* Tabpanel for table view */}
          <Tab.Panel>
            <Table columns={taskTableColumns} data={tasks} />
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
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}

      <p>
        <Link className="btn mt-4 btn-primary" href={Routes.NewTaskPage({ projectId: projectId! })}>
          Create New Task
        </Link>
      </p>
    </div>
  )
}
