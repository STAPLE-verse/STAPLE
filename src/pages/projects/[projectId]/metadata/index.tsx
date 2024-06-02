import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"

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
            <div role="tablist" className="tabs tabs-lifted">
              <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Edit" />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                Edit
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab"
                aria-label="View"
                checked
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                View
              </div>
            </div>
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default MetadataPage
