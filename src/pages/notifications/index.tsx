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
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const NotificationContent = () => {
  const currentUser = useCurrentUser()

  // Get notifications
  const [{ notifications }, { refetch }] = usePaginatedQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { project: true },
  })

  const extendedNotifications = notifications as unknown as ExtendedNotification[]

  // Get columns and pass refetch
  const columns = useNotificationTableColumns(refetch)

  console.log(notifications)

  return (
    <>
      <Head>
        <title>All Notifications</title>
      </Head>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">All Notifications</h1>
        <Table columns={columns} data={extendedNotifications} addPagination={true} />
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
