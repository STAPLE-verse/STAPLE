import { Suspense } from "react"
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
import { MultiSelectProvider, useMultiSelect } from "src/core/components/fields/MultiSelectContext"
import { DeleteNotificationButton } from "src/notifications/components/DeleteNotificationButton"
import { MultiReadToggleButton } from "src/notifications/components/MultiReadToggleButton"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"

const NotificationContent = () => {
  const currentUser = useCurrentUser()
  const { selectedIds, resetSelection } = useMultiSelect()

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
  const columns = useNotificationTableColumns(refetch, notificationTableData)

  const selectedNotifications = extendedNotifications.filter((n) => selectedIds.includes(n.id))

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center items-center text-3xl">
        All Notifications
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="dashboard-overview"
        />
        <Tooltip
          id="dashboard-overview"
          content="This page shows all your notifications. You can mark them as read or click on a link to view the related item. Use the last column to select multiple notifications at once."
          className="z-[1099] ourtooltips"
        />
      </h1>

      <div className="flex justify-center m-4">
        <DeleteNotificationButton ids={selectedIds} />
        <MultiReadToggleButton
          notifications={selectedNotifications}
          refetch={refetch}
          resetSelection={resetSelection}
        />
      </div>
      <Card title={""}>
        <Table columns={columns} data={notificationTableData} addPagination={true} />
      </Card>
    </main>
  )
}
const NotificationsPage = () => {
  return (
    <Layout title="All Notifications">
      <Suspense fallback={<div>Loading...</div>}>
        <MultiSelectProvider>
          <NotificationContent />
        </MultiSelectProvider>
      </Suspense>
    </Layout>
  )
}

export default NotificationsPage
