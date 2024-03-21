import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getTasks from "src/tasks/queries/getTasks"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Table from "src/core/components/Table"
import { taskTableColumns } from "src/tasks/components/TaskTable"

const ITEMS_PER_PAGE = 100

export const AllTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()
  // const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
  //   where: { assignees: { some: { contributor: { user: { id: currentUser?.id } } } } },
  //   orderBy: { id: "asc" },
  //   skip: ITEMS_PER_PAGE * page,
  //   take: ITEMS_PER_PAGE,
  // })

  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      OR: [
        { assignees: { some: { contributor: { user: { id: currentUser?.id } }, teamId: null } } },
        {
          assignees: {
            some: {
              team: { contributors: { some: { id: currentUser?.id } } },
              contributorId: null,
            },
          },
        },
      ],
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2">All tasks</h1>
      <Table columns={taskTableColumns} data={tasks} />
    </main>
  )
}

const AllTasksPage = () => {
  const sidebarItems = HomeSidebarItems("Tasks")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
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
