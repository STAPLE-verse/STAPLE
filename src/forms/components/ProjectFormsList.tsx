import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { TaskWithFormVersion, projectFormsTableColumns } from "./ProjectFormsTable"

const ITEMS_PER_PAGE = 10

export const ProjectFormsList = () => {
  // Setup
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const page = Number(router.query.page) || 0

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  // Get tasks with latest FormVersion
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      project: { id: projectId! },
      formVersionId: {
        not: null, // Ensure formVersionId is defined
      },
    },
    include: {
      formVersion: true, // Include formVersion relation
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  return (
    <div>
      <Table data={tasks as TaskWithFormVersion[]} columns={projectFormsTableColumns} />
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
