import { Suspense } from "react"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectDashboard from "src/projects/components/ProjectDashboard"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

export const ShowProjectPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Dashboard")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project {project.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <h1>{project.name}</h1>
          <div className="flex flex-col gap-4">
            <p className="">{project.description}</p>
            <p className="italic">
              Last update:{" "}
              {project.updatedAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Use 24-hour format
              })}
            </p>
          </div>
          <div className="divider mt-4 mb-4"></div>
          <ProjectDashboard />
        </main>
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage
