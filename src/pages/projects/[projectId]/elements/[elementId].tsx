import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import { ElementInformation } from "src/elements/components/ElementInformation"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"
import { ElementSummary } from "src/elements/components/ElementSummary"

const ShowElementPage = () => {
  // Contributor authentication
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])
  const { privilege } = useContributorPrivilege()

  // Get elements
  const projectId = useParam("projectId", "number")
  const elementId = useParam("elementId", "number")
  const [element, { refetch }] = useQuery(getElement, { id: elementId })

  return (
    <Layout>
      <Head>
        <title>Element {element.id}</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ElementInformation element={element} projectId={projectId} onTasksUpdated={refetch} />
            {privilege == ContributorPrivileges.PROJECT_MANAGER && (
              <ElementSummary element={element} projectId={projectId} />
            )}
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

ShowElementPage.authenticate = true

export default ShowElementPage
