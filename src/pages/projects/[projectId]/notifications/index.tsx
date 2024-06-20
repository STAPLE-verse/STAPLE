import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { useNotification } from "src/messages/components/NotificationContext"
import Table from "src/core/components/Table"
import { useProjectNotificationTableColumns } from "src/messages/hooks/useNotificationTable"

const NotificationContent = () => {
  // Get notifications
  const { notifications, page, hasMore, goToPreviousPage, goToNextPage } = useNotification()

  // Get columns and pass refetch
  const columns = useProjectNotificationTableColumns()

  return (
    <>
      <Head>
        <title>Project Notifications</title>
      </Head>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Notifications</h1>
        <Table columns={columns} data={notifications} />
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
