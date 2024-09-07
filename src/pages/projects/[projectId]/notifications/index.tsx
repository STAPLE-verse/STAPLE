import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import {
  ExtendedNotification,
  useProjectNotificationTableColumns,
} from "src/notifications/hooks/useNotificationTable"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { processNotifications } from "src/notifications/utils/processNotifications"

const NotificationContent = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

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

  // Get columns and pass refetch
  const columns = useProjectNotificationTableColumns(refetch)

  return (
    <>
      <Head>
        <title>Project Notifications</title>
      </Head>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Notifications</h1>
        <Table columns={columns} data={extendedNotifications} addPagination={true} />
      </main>
    </>
  )
}

const ProjectNotificationsPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationContent />
      </Suspense>
    </Layout>
  )
}

export default ProjectNotificationsPage
