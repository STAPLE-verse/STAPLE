import { useParam } from "@blitzjs/next"
import { projectTasksTableColumns } from "src/tasks/components/TaskTable"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")

  const { tasks } = useProjecTasksListData(projectId)

  return (
    <div>
      <Table columns={projectTasksTableColumns} data={tasks} addPagination={true} />
    </div>
  )
}
