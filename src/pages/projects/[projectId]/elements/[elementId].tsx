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

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>{element.name}</h1>
        {/* <pre>{JSON.stringify(element, null, 2)}</pre> */}
        <div className="flex flex-col gap-2">
          <p>{element.description}</p>
          <p className="italic">Last update: {element.updatedAt.toString()}</p>
        </div>
        <div className="flex justify-start mt-4">
          <Link
            className="btn"
            href={Routes.EditElementPage({ projectId: projectId!, elementId: element.id })}
          >
            Update element
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn"
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
      </main>
    </>
  )
}

const ShowElementPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
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
