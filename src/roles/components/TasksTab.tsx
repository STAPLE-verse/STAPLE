import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import React from "react"
import { AddRoleModal } from "./AddRoleModal"
import { RoleTaskTable } from "./RoleTaskTable"
import { MultiSelectProvider } from "src/core/components/fields/MultiSelectContext"

const TasksTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: { project: { id: projectId! } },
    include: { roles: true },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <MultiSelectProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RoleTaskTable tasks={tasks} />
          <div className="modal-action flex justify-end mt-4">
            <AddRoleModal projectId={projectId} rows={tasks} refetch={refetch} type={"task"} />
          </div>
        </Suspense>
      </MultiSelectProvider>
    </main>
  )
}

export default TasksTab
