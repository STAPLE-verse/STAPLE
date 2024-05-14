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

const SummaryPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Summary")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project Summary</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <h1 className="flex justify-center mb-2">Project Summary</h1>

          <div className="flex flex-row justify-center m-2">
            A dropdown menu here for organization: By Date, By Task, By Contributor, By Label, By
            Element
          </div>

          <div className="flex flex-row justify-center m-2">
            <div className="card bg-base-300 mx-2 w-full">
              <div className="card-body">
                <div className="card-title">Project Metadata</div>
                <br /> WORD IN CAPS IS THE DATABASE COLUMN
                <br />
                Name: NAME
                <br />
                Created: CREATEDAT
                <br />
                Update: UPDATEDAT
                <br />
                Description: DESCRIPTION
                <br />
                Abstract: ABSTRACT
                <br />
                Keywords: KEYWORDS
                <br />
                Citation: CITATION
                <br />
                Publisher: PUBLISHER
                <br />
                Identifier: IDENTIFIER
                <div class="card-actions justify-end">
                  <Link
                    className="btn btn-primary"
                    href={Routes.EditProjectPage({ projectId: projectId! })}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center m-2">
            <div className="card bg-base-300 mx-2 w-full">
              <div className="card-body">
                <div className="card-title">Organized Metadata</div>
                <br />
                Here we will print out the database basically by organization they pick at the top
                <br />
                So, if they pick by date: Print out the date, everything that happened on that date
                with breaks between the dates
                <br />
                If they pick by task, loop through the tasks and print out each thing, etc.
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </Layout>
  )
}

export default SummaryPage
