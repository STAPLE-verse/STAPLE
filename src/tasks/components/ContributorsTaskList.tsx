import { usePaginatedQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { taskTableColumns } from "src/tasks/components/TaskTable"
import { useRouter } from "next/router"
import getTasks from "src/tasks/queries/getTasks"

const ITEMS_PER_PAGE = 10

export const ContributorTaskList = ({ usersId }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      OR: [
        { assignees: { some: { contributor: { user: { id: { in: usersId } } }, teamId: null } } },
        {
          assignees: {
            some: {
              team: { contributors: { some: { id: { in: usersId } } } },
              contributorId: null,
            },
          },
        },
      ],
    },
    include: {
      project: true,
      assignees: { include: { statusLogs: { orderBy: { changedAt: "desc" } } } },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Table columns={taskTableColumns} data={tasks} />
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