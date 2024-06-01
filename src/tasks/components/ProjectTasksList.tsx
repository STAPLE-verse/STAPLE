import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import {
  taskProjectTableColumnsContrib,
  taskProjectTableColumnsPM,
} from "src/tasks/components/TaskTable"
import TaskBoard from "src/tasks/components/TaskBoard"
import Table from "src/core/components/Table"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { ContributorPrivileges } from "@prisma/client"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

// TODO: The number of items per page will affect the number of tasks shown in the table
const ITEMS_PER_PAGE = 10

export const ProjectTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const page2 = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  // all tasks for PM
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  // only contributor tasks and assignment status
  const [{ tasksContrib, hasMore2 }] = usePaginatedQuery(getTasks, {
    where: {
      OR: [
        { assignees: { some: { contributor: { user: { id: currentUser?.id } }, teamId: null } } },
        {
          assignees: {
            some: {
              team: { contributors: { some: { id: currentUser?.id } } },
              contributorId: null,
            },
          },
        },
      ],
      project: { id: projectId! },
    },
    include: {
      project: true,
      assignees: { include: { statusLogs: { orderBy: { changedAt: "desc" } } } },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page2,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage2 = () => router.push({ query: { page: page2 - 1 } })
  const goToNextPage2 = () => router.push({ query: { page: page2 + 1 } })

  return (
    <div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
            <Tab
              className={({ selected }) =>
                classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
              }
            >
              Board
            </Tab>
          )}
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
          {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
            <Tab.Panel>
              <TaskBoard projectId={projectId!} />
            </Tab.Panel>
          )}
          {/* Tabpanel for table view */}
          <Tab.Panel>
            {currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR && (
              <Table columns={taskProjectTableColumnsContrib} data={tasksContrib} />
            )}

            {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
              <Table columns={taskProjectTableColumnsPM} data={tasks} />
            )}

            <div className="join grid grid-cols-2 my-6">
              <button
                className="join-item btn btn-secondary"
                disabled={
                  currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR
                    ? page2 === 0
                    : page === 0
                }
                onClick={
                  currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR
                    ? goToPreviousPage2
                    : goToPreviousPage
                }
              >
                Previous
              </button>
              <button
                className="join-item btn btn-secondary"
                disabled={
                  currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR
                    ? !hasMore2
                    : !hasMore
                }
                onClick={
                  currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR
                    ? goToNextPage2
                    : goToNextPage
                }
              >
                Next
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}
      {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
        <p>
          <Link
            className="btn mt-4 btn-primary"
            href={Routes.NewTaskPage({ projectId: projectId! })}
          >
            Create New Task
          </Link>
        </p>
      )}
    </div>
  )
}
