import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import React from "react"
import { AllTasksRolesList } from "./AllTasksRolesList"

const TasksTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: { project: { id: projectId! } },
    include: { roles: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksRolesList tasks={tasks} onChange={reloadTable} projectId={projectId} />
        </Suspense>
      </div>
    </main>
  )
}

export default TasksTab
