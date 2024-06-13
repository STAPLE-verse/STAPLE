import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"

import { ProjectFormTable, projectFormTableColumns } from "src/forms/components/ProjectFormsTable"

const MetadataPage = () => {
  return (
    <Layout>
      <Head>
        <title>Form Data</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Form Data</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectFormTable />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default MetadataPage
