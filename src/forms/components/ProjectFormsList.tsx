import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { ProjectFormsColumns } from "../tables/columns/ProjectFormsColumns"
import { processProjectForms } from "../tables/processing/processProjectForms"
import { FormVersion, Task, TaskLog } from "db"
import Card from "src/core/components/Card"

export interface TaskwithFormandLog extends Task {
  formVersion: FormVersion | null
  taskLogs: TaskLog[]
}

export const ProjectFormsList = () => {
  // Setup
  const projectId = useParam("projectId", "number")

  // Get tasks with FormVersion
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId! },
      formVersionId: {
        not: null, // Ensure formVersionId is defined
      },
    },
    include: {
      formVersion: true, // Include formVersion relation
      taskLogs: true,
    },
    orderBy: { id: "asc" },
  })

  const projectFormsTableData = processProjectForms(tasks as TaskwithFormandLog[])
  console.log(tasks)
  return (
    <Card title="">
      <Table data={projectFormsTableData} columns={ProjectFormsColumns} addPagination={true} />
    </Card>
  )
}
