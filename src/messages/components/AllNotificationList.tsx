import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Table from "src/core/components/Table"
import getNotifications from "src/messages/queries/getNotifications"
import { notificationTableColumns } from "src/messages/components/notificationTable"

const ITEMS_PER_PAGE = 10

export const AllNotificationList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  const [{ notifications, hasMore }, { refetch }] = usePaginatedQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
    },
    include: { project: true },
    orderBy: [
      { read: "asc" }, // Show unread notifications first
      { id: "asc" }, // Then sort by id
    ],
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  console.log(notifications)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  // Get columns and pass refetch
  const columns = notificationTableColumns(refetch)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Notifications</h1>
      <Table columns={columns} data={notifications} />
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
    </main>
  )
}
