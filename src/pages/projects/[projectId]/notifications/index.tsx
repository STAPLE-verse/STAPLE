import { Suspense, useMemo } from "react"
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
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

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
  const projectNotificationTableData = useMemo(
    () => processProjectNotification(extendedNotifications),

    [extendedNotifications]
  )

  // Get columns and pass refetch
  const columns = useProjectNotificationTableColumns(refetch, projectNotificationTableData)

  const selectedNotifications = extendedNotifications.filter((n) => selectedIds.includes(n.id))

  return (
    <main className="flex flex-col mx-auto w-full">
      <div className="flex justify-center items-center gap-2 mb-2">
        <h1 className="text-3xl">Project Notifications</h1>
        <InformationCircleIcon
          className="h-5 w-5 stroke-2 text-info"
          data-tooltip-id="project-notifications-tooltip"
        />
        <Tooltip
          id="project-notifications-tooltip"
          content="These are notifications for this project only. You can delete or mark them as read using the select options."
          className="z-[1099] ourtooltips"
        />
      </div>
      <div className="flex justify-center mt-4 mb-2 gap-2">
        <DeleteNotificationButton ids={selectedIds} />
        <MultiReadToggleButton
          notifications={selectedNotifications}
          refetch={refetch}
          resetSelection={resetSelection}
        />
      </div>
      <Card title="">
        <Table columns={columns} data={projectNotificationTableData} addPagination={true} />
      </Card>
    </main>
  )
}

const ProjectNotificationsPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
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
