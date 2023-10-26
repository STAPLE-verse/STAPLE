import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery, useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import React, { useCallback } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import { ElementsList } from "src/elements/components/ElementList"
import getElements from "src/elements/queries/getElements"

const ElementsPage = () => {
  const projectId = useParam("projectId", "number")
  const [elements] = useQuery(getElements, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: { Task: true },
  })

  return (
    <>
      <Head>
        <title>Elements</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Elements</h1>
        <Link className="btn mb-4" href={Routes.NewElementPage({ projectId: projectId! })}>
          Create Element
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="h-6 w-6"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList projectId={projectId!} elements={elements} />
        </Suspense>
      </main>
    </>
  )
}

ElementsPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)
export default ElementsPage
