import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectNotificationList } from "src/messages/components/ProjectNotificationList"
import { useParam } from "@blitzjs/next"

const ProjectNotificationsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <Layout>
      <Head>
        <title>Project Notifications</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectNotificationList projectId={projectId} />
        </Suspense>
      </main>
    </Layout>
  )
}

export default ProjectNotificationsPage
