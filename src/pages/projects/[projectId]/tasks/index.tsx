import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"
import { ProjectTasksList } from "src/tasks/components/ProjectTasksList"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"

const TasksPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })

  const sidebarItems = ProjectSidebarItems(projectId!, "Tasks")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Tasks</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectTasksList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default TasksPage
