import { useParam } from "@blitzjs/next"
import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import Table from "src/core/components/Table"
import useProjecTasksListData from "../hooks/useProjectTasksListData"
import Card from "src/core/components/Card"

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")

  const { tasks } = useProjecTasksListData(projectId)

  return (
    <Card title={""}>
      <Table columns={ProjectTasksColumns} data={tasks} addPagination={true} />
    </Card>
  )
}
