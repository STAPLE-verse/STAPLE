import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { ProjectNotificationList } from "src/messages/components/ProjectNotificationList"

const ProjectNotificationsPage = ({ projectId: projectId }) => {
  const sidebarItems = ProjectSidebarItems("Notifications")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Project Notifications</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectNotificationList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default ProjectNotificationsPage
