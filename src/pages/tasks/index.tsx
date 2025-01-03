import Layout from "src/core/layouts/Layout"
import { AllTasksList } from "src/tasks/components/AllTaskList"
import { Suspense } from "react"
import PageHeader from "src/core/components/PageHeader"

const AllTasksPage = () => {
  return (
    <Layout title="All Tasks">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <PageHeader className="flex justify-center mb-2" title="All Tasks" />
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllTasksPage
