import { Suspense } from "react"
import { OverallElement, PMElement } from "src/elements/components/ElementDashboard"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import deleteElement from "src/elements/mutations/deleteElement"

const ShowElementPage = () => {
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteElementMutation] = useMutation(deleteElement)
  const [element] = useQuery(getElement, { id: elementId })

  return (
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
  )
}

ShowElementPage.authenticate = true

export default ShowElementPage
