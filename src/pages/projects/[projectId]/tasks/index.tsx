import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Tab } from "@headlessui/react"

import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import getTasks from "src/tasks/queries/getTasks"
import TaskTable from "src/tasks/components/TaskTable"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const ITEMS_PER_PAGE = 8

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

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div className="flex flex-col">
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs flex justify-center space-x-2">
          <Tab
            className={({ selected }) =>
              classNames("tab tab-lifted tab-lg", selected ? "text-black" : "hover:text-gray-500")
            }
          >
            Table
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames("tab tab-lifted tab-lg", selected ? "text-black" : "hover:text-gray-500")
            }
          >
            Board
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <TaskTable tasks={tasks} />
          </Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}
      <p>
        <Link className="btn" href={Routes.NewTaskPage({ projectId: projectId! })}>
          Create Task
        </Link>
      </p>

      {/* Previous and next page btns */}
      {/* <div className="join grid grid-cols-2 mt-4">
        <button
          className="join-item btn btn-outline"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-outline" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div> */}
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

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList />
        </Suspense>
      </main>
    </>
  )
}

TasksPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default TasksPage
