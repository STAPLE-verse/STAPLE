import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getElement from "src/elements/queries/getElement"
import deleteElement from "src/elements/mutations/deleteElement"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

export const Element = () => {
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const [deleteElementMutation] = useMutation(deleteElement)
  const [element] = useQuery(getElement, { id: elementId })

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Element {element.id}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xlfupd">{element.name}</h1>
        {/* <pre>{JSON.stringify(element, null, 2)}</pre> */}
        <div className="flex flex-col gap-2">
          <p>{element.description}</p>
          <p className="italic">
            Last update:{" "}
            {element.updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // Use 24-hour format
            })}
          </p>
        </div>
        <div className="flex justify-start mt-4">
          <Link
            className="btn btn-primary"
            href={Routes.EditElementPage({ projectId: projectId!, elementId: element.id })}
          >
            Update element
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={async () => {
              if (window.confirm("This element will be deleted. Is that ok?")) {
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
    </Layout>
  )
}

const ShowElementPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Element />
      </Suspense>
    </div>
  )
}

ShowElementPage.authenticate = true

export default ShowElementPage
