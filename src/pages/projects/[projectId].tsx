import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import ProjectDashboard from "src/projects/components/ProjectDashboard"

export const Project = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })

  return (
    <>
      <Head>
        <title>Project {project.name}</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4">
          <p className="">{project.description}</p>
          <p className="italic">Last update: {project.updatedAt.toString()}</p>
        </div>
        <div className="divider mt-4 mb-4"></div>
        <ProjectDashboard />
      </main>
    </>
  )
}

const ShowProjectPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Project />
      </Suspense>
    </div>
  )
}

ShowProjectPage.authenticate = true
ShowProjectPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default ShowProjectPage
