import { useParam } from "@blitzjs/next"
import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")

  const { tasks } = useProjecTasksListData(projectId)

  return (
    <div>
      <Table columns={ProjectTasksColumns} data={tasks} addPagination={true} />
    </div>
  )
}
