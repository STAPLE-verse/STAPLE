import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Table from "src/core/components/Table"
import getNotifications from "src/messages/queries/getNotifications"
import { notificationTableColumns } from "src/messages/components/notificationTable"

const ITEMS_PER_PAGE = 100

export const NotificationList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  const [{ notifications, hasMore }] = usePaginatedQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Notifications</h1>
      <Table columns={notificationTableColumns} data={notifications} />
    </main>
  )
}

const NotificationsPage = () => {
  const sidebarItems = HomeSidebarItems("Notifications")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>All Notifications</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <NotificationList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default NotificationsPage
