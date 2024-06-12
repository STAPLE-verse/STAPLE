import { usePaginatedQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { taskTableColumns } from "src/tasks/components/TaskTable"
import { Routes } from "@blitzjs/next"
import router, { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTasks from "src/tasks/queries/getTasks"
import { ContributorTaskList } from "./ContributorsTaskList"

const ITEMS_PER_PAGE = 10

export const AllTasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
      <ContributorTaskList userId={currentUser?.id}></ContributorTaskList>
    </main>
  )
}
