import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useNotificationTableColumns } from "src/notifications/tables/columns/NotificationColumns"
import {
  ExtendedNotification,
  processNotification,
} from "src/notifications/tables/processing/processNotification"

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
      // Only include notifications for projects where the contributor is not deleted
      project: {
        projectMembers: {
          some: {
            users: {
              some: { id: currentUser!.id },
            },
            name: null, // Contributor (indicating it's not a team)
            deleted: false, // Only include undeleted project members
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { project: true },
  })

  const extendedNotifications = notifications as unknown as ExtendedNotification[]

  // Preprocess table data
  const notificationTableData = processNotification(extendedNotifications)

  // Get columns and pass refetch
  const columns = useNotificationTableColumns(refetch)

  return (
    <>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">All Notifications</h1>
        <Table columns={columns} data={notificationTableData} addPagination={true} />
      </main>
    </>
  )
}
const NotificationsPage = () => {
  return (
    <Layout title="All Notifications">
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationContent />
      </Suspense>
    </Layout>
  )
}

export default NotificationsPage
