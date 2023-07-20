import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import getTasks from "src/tasks/queries/getTasks"

const ITEMS_PER_PAGE = 100

export const TasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link href={Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id })}>
              {task.name}
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TasksPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <>
      <Head>
        <title>Tasks</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList />
        </Suspense>

        <p>
          <Link href={Routes.NewTaskPage({ projectId: projectId! })}>Create Task</Link>
        </p>
      </div>
    </>
  )
}

TasksPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default TasksPage
