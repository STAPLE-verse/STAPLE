import { Suspense, useState } from "react"
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
import TaskBoard from "src/tasks/components/TaskBoard"
import Modal from "src/core/components/Modal"

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

  // New task modal toggle
  // const [open, setOpen] = useState(false)
  // const handleToggle = () => setOpen((prev) => !prev)

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          <Tab
            className={({ selected }) =>
              classNames("tab tab-lifted tab-lg", selected ? "text-black" : "hover:text-gray-500")
            }
          >
            Board
          </Tab>
          {/* TabLink for table view */}
          <Tab
            className={({ selected }) =>
              classNames("tab tab-lifted tab-lg", selected ? "text-black" : "hover:text-gray-500")
            }
          >
            Table
          </Tab>
          {/* TODO: First click on board does not change it after init */}
        </Tab.List>

        <Tab.Panels>
          {/* Tabpanel for kanban board */}
          <Tab.Panel>
            <TaskBoard projectId={projectId!} />
          </Tab.Panel>
          {/* Tabpanel for table view */}
          <Tab.Panel>
            <TaskTable tasks={tasks} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}

      <p>
        <Link className="btn mt-4" href={Routes.NewTaskPage({ projectId: projectId! })}>
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
