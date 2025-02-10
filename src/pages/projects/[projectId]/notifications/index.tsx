import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useProjectNotificationTableColumns } from "src/notifications/tables/columns/ProjectNotificationTableColumns"
import { ExtendedNotification } from "src/notifications/tables/processing/processNotification"
import { processProjectNotification } from "src/notifications/tables/processing/processProjectNotification"
import { MultiSelectProvider, useMultiSelect } from "src/core/components/fields/MultiSelectContext"
import { DeleteNotificationButton } from "src/notifications/components/DeleteNotificationButton"
import { MultiReadToggleButton } from "src/notifications/components/MultiReadToggleButton"

const NotificationContent = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const { selectedIds, resetSelection } = useMultiSelect()

  // Get notifications
  const [{ notifications }, { refetch }] = useQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser?.id,
        },
      },
      projectId: projectId,
    },
    orderBy: { createdAt: "desc" },
    include: { project: true },
  })

  const extendedNotifications = notifications as unknown as ExtendedNotification[]

  // Preprocess table data
  const projectNotificationTableData = processProjectNotification(extendedNotifications)

  // Get columns and pass refetch
  const columns = useProjectNotificationTableColumns(refetch, projectNotificationTableData)

  const selectedNotifications = extendedNotifications.filter((n) => selectedIds.includes(n.id))

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">Project Notifications</h1>
      <Table columns={columns} data={projectNotificationTableData} addPagination={true} />
      <div className="flex justify-end mt-4 gap-4">
        <DeleteNotificationButton ids={selectedIds} />
        <MultiReadToggleButton
          notifications={selectedNotifications}
          refetch={refetch}
          resetSelection={resetSelection}
        />
      </div>
    </main>
  )
}

const ProjectNotificationsPage = () => {
  return (
    <Layout title="Project Notifications">
      <Suspense fallback={<div>Loading...</div>}>
        <MultiSelectProvider>
          <NotificationContent />
        </MultiSelectProvider>
      </Suspense>
    </Layout>
  )
}

export default ProjectNotificationsPage
