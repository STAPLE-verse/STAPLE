import { Suspense } from "react"
import { OverallElement, PMElement } from "src/elements/components/ElementDashboard"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import ContributorAuthorization from "src/contributors/components/ContributorAuthorization"

const ShowElementPage = () => {
  const elementId = useParam("elementId", "number")
  const [element] = useQuery(getElement, { id: elementId })

  return (
    <ContributorAuthorization requiredPrivileges={["PROJECT_MANAGER"]}>
      <Layout>
        <Head>
          <title>Element {element.id}</title>
        </Head>
        <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <OverallElement />
              <PMElement />
            </Suspense>
          </div>
        </main>
      </Layout>
    </ContributorAuthorization>
  )
}

ShowElementPage.authenticate = true

export default ShowElementPage
