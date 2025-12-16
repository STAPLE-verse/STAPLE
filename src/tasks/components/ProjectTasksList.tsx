import { useParam } from "@blitzjs/next"
import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"
import { useState } from "react"
import { PaginationState } from "@tanstack/react-table"

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { tasks, count } = useProjecTasksListData(projectId, pagination)
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / pagination.pageSize))

  const handlePaginationChange = (
    updater: PaginationState | ((state: PaginationState) => PaginationState)
  ) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
  }

  return (
    <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
      <div className="overflow-x-auto">
        <Table
          columns={ProjectTasksColumns}
          data={tasks}
          addPagination={true}
          manualPagination={true}
          paginationState={pagination}
          onPaginationChange={handlePaginationChange}
          pageCount={pageCount}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  )
}
