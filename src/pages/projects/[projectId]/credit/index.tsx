import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { PlusIcon } from "@heroicons/react/24/outline"

const CreditPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Credit")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Project Summary</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Assign Credit</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <div role="tablist" class="tabs tabs-lifted">
              <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Edit" />
              <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Edit
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                class="tab"
                aria-label="View"
                checked
              />
              <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
                View
              </div>
            </div>
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default CreditPage
