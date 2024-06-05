import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import React from "react"
import { ElementsList } from "src/elements/components/ElementList"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

const ElementsPage = () => {
  const projectId = useParam("projectId", "number")

  const [project] = useQuery(getProject, { id: projectId })

  const sidebarItems = ProjectSidebarItems(projectId!, "Elements")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Elements</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Elements</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4 mt-4"
            href={Routes.NewElementPage({ projectId: projectId! })}
          >
            Create Element
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default ElementsPage
