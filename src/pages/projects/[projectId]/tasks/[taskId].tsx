// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// can't figure this one out

// imports
import { ContributorTaskView } from "src/tasks/components/ContributorTaskView"
import { PMTaskView } from "src/tasks/components/PMTaskView"
import { Suspense, useState } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import getTask from "src/tasks/queries/getTask"

// show the task page
export const ShowTaskPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const taskId = useParam("taskId", "number")
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })

  // return the page
  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Task {task.name}</title>
        </Head>

        <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
          <ContributorTaskView />
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage
