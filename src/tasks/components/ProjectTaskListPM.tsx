import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { taskProjectTableColumnsPM } from "src/tasks/components/TaskTable"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"

const ITEMS_PER_PAGE = 10

export const ProjectTaskListPM = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  // all tasks for PM
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  return (
    <div>
      <Table columns={taskProjectTableColumnsPM} data={tasks} />
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
