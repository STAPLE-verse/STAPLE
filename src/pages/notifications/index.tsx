import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import {
  ExtendedNotification,
  useNotificationTableColumns,
} from "src/notifications/hooks/useNotificationTable"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import router from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 10

const NotificationContent = () => {
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  // Get notifications
  const [{ notifications, hasMore }, { refetch }] = usePaginatedQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { project: true },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const extendedNotifications = notifications as unknown as ExtendedNotification[]

  // Get columns and pass refetch
  const columns = useNotificationTableColumns(refetch)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <Head>
        <title>All Notifications</title>
      </Head>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">All Notifications</h1>
        <Table columns={columns} data={extendedNotifications} />
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
      </main>
    </>
  )
}
const NotificationsPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationContent />
      </Suspense>
    </Layout>
  )
}

export default NotificationsPage
