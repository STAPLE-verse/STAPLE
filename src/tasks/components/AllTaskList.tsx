import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getTasks from "../queries/getTasks"
import Table from "src/core/components/Table"
import { taskTableColumns } from "./TaskTable"

const ITEMS_PER_PAGE = 10

export const AllTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0

  const currentUser = useCurrentUser()

  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      OR: [
        {
          assignees: {
            some: { contributor: { user: { id: { in: currentUser?.id } } }, teamId: null },
          },
        },
        {
          assignees: {
            some: {
              team: { contributors: { some: { id: { in: currentUser?.id } } } },
              contributorId: null,
            },
          },
        },
      ],
    },
    include: {
      project: true,
      assignees: { include: { statusLogs: { orderBy: { createdAt: "desc" } } } },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
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
          <button
            className="join-item btn btn-secondary"
            disabled={!hasMore}
            onClick={goToNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  )
}
