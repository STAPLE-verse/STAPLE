import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { ProjectNotificationList } from "src/messages/components/ProjectNotificationList"
import { useQuery } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import { useParam } from "@blitzjs/next"

const ProjectNotificationsPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Notifications")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
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
