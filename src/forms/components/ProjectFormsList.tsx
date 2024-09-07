import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { TaskWithFormVersion, projectFormsTableColumns } from "./ProjectFormsTable"

const ITEMS_PER_PAGE = 10

export const ProjectFormsList = () => {
  // Setup
  const projectId = useParam("projectId", "number")

  // Get tasks with latest FormVersion
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

  console.log(tasks)

  return (
    <div>
      <Table
        data={tasks as TaskWithFormVersion[]}
        columns={projectFormsTableColumns}
        addPagination={true}
      />
    </div>
  )
}
