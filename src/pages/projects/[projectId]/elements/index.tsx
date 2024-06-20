import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import React from "react"
import { ElementsList } from "src/elements/components/ElementList"
import getElements from "src/elements/queries/getElements"

const ElementsPage = () => {
  const projectId = useParam("projectId", "number")
  const [elements] = useQuery(getElements, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: { task: true },
  })

  return (
    <Layout>
      <Head>
        <title>Elements</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Elements</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4 mt-4"
            href={Routes.NewElementPage({ projectId: projectId! })}
          >
            Create Element
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default ElementsPage
