import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { Routes, useParam } from "@blitzjs/next"
import React from "react"
import { AddRoleModal } from "./AddRoleModal"
import { RoleTaskTable } from "./RoleTaskTable"
import { MultiSelectProvider } from "src/core/components/fields/MultiSelectContext"
import Link from "next/link"
import { Tooltip } from "react-tooltip"

const TasksTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: { project: { id: projectId! } },
    include: { roles: true },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mx-auto w-full">
      <MultiSelectProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
            <RoleTaskTable tasks={tasks} />
            <div className="modal-action flex justify-between mt-4">
              <Link
                href={Routes.RoleBuilderPage()}
                className="btn btn-secondary"
                data-tooltip-id="roles-overview"
              >
                Go to Create Roles
              </Link>
              <Tooltip
                id="roles-overview"
                content="Set up project roles on the Roles page so you can assign them on this page. You can add or edit roles later."
                className="z-[1099] ourtooltips"
              />
              <AddRoleModal projectId={projectId} rows={tasks} refetch={refetch} type={"task"} />
            </div>
          </div>
        </Suspense>
      </MultiSelectProvider>
    </main>
  )
}

export default TasksTab
