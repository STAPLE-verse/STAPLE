import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { ProjectFormsColumns } from "../tables/columns/ProjectFormsColumns"
import { processProjectForms } from "../tables/processing/processProjectForms"
import { FormVersion, Task } from "db"

export interface TaskWithFormVersion extends Task {
  formVersion: FormVersion | null
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
    },
    orderBy: { id: "asc" },
  })

  const projectFormsTableData = processProjectForms(tasks as TaskWithFormVersion[])

  return (
    <div>
      <Table data={projectFormsTableData} columns={ProjectFormsColumns} addPagination={true} />
    </div>
  )
}
