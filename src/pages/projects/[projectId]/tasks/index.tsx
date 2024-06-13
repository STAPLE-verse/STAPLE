import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectTasksList } from "src/tasks/components/ProjectTasksList"

const TasksPage = () => {
  return (
    <Layout>
      <Head>
        <title>Tasks</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectTasksTabs />
        </Suspense>
      </main>
    </Layout>
  )
}

export default TasksPage
