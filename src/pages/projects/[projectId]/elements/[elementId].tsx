import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import deleteElement from "src/elements/mutations/deleteElement"

export const Element = () => {
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteElementMutation] = useMutation(deleteElement)
  const [element] = useQuery(getElement, { id: elementId })

  return (
    <>
      <Head>
        <title>Element {element.id}</title>
      </Head>

      <div>
        <h1>Element {element.id}</h1>
        <pre>{JSON.stringify(element, null, 2)}</pre>

        <Link href={Routes.EditElementPage({ projectId: projectId!, elementId: element.id })}>
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteElementMutation({ id: element.id })
              await router.push(Routes.ElementsPage({ projectId: projectId! }))
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowElementPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <p>
        <Link href={Routes.ElementsPage({ projectId: projectId! })}>Elements</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Element />
      </Suspense>
    </div>
  )
}

ShowElementPage.authenticate = true
ShowElementPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default ShowElementPage
