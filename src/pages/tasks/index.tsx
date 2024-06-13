import Layout from "src/core/layouts/Layout"
import { AllTasksList } from "src/tasks/components/AllTaskList"
import Head from "next/head"
import { Suspense } from "react"

const AllTasksPage = () => {
  return (
    <Layout>
      <Head>
        <title>All Tasks</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllTasksPage
