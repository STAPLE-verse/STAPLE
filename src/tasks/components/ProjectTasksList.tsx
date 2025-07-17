import { useParam } from "@blitzjs/next"
import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")

  const { tasks } = useProjecTasksListData(projectId)

  return (
    <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
      <div className="overflow-x-auto">
        <Table columns={ProjectTasksColumns} data={tasks} addPagination={true} />
      </div>
    </div>
  )
}
