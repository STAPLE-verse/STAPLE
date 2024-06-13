import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { AllNotificationList } from "src/messages/components/AllNotificationList"

const NotificationsPage = () => {
  return (
    <Layout>
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
