import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getTasks from "src/tasks/queries/getTasks"
import Table from "src/core/components/Table"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { taskProjectTableColumnsContrib } from "src/tasks/components/TaskTable"

const ITEMS_PER_PAGE = 10

export const ProjectTaskListContrib = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
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
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ projectId: projectId, query: { page: page - 1 } })
  const goToNextPage = () => router.push({ projectId: projectId, query: { page: page + 1 } })
  console.log(tasks)

  return (
    <div>
      <Table columns={taskProjectTableColumnsContrib} data={tasks} />
      <div className="join grid grid-cols-2 my-6">
        <button className="join-item btn btn-secondary" disabled={page} onClick={goToPreviousPage}>
          Previous
        </button>
        <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}
