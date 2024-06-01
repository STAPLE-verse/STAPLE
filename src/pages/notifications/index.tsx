import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { AllNotificationList } from "src/messages/components/AllNotificationList"

const NotificationsPage = () => {
  const sidebarItems = HomeSidebarItems("Notifications")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>All Notifications</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <AllNotificationList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default NotificationsPage
