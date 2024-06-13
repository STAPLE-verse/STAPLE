import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { taskProjectTableColumnsPM } from "src/tasks/components/TaskTable"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"

export const ProjectTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const { tasks, hasMore } = useProjecTasksListData(projectId, page)
  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  return (
    <div>
      <Table columns={taskProjectTableColumnsPM} data={tasks} />
      <div className="join grid grid-cols-2 my-6">
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
