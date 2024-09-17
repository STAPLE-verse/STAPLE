import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { ElementInformation } from "src/elements/components/ElementInformation"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import { ElementSummary } from "src/elements/components/ElementSummary"

const ShowElementPage = () => {
  // Contributor authentication
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const { privilege } = useMemberPrivileges()

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
            {privilege == MemberPrivileges.PROJECT_MANAGER && (
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
