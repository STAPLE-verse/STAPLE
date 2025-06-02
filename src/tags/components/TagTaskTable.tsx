import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import Table from "src/core/components/Table"
import {
  ProjectTasksData,
  processProjectTasks,
} from "src/tasks/tables/processing/processProjectTasks"
import { Task } from "db"
import CollapseCard from "src/core/components/CollapseCard"

interface TagTaskTableProps {
  tasks: Task[]
}

export const TagTaskTable = ({ tasks }: TagTaskTableProps) => {
  const processedTasks: ProjectTasksData[] = processProjectTasks(tasks)

  return (
    <CollapseCard title="Tasks" className="mt-4">
      <div className="overflow-x-auto">
        <Table columns={ProjectTasksColumns} data={processedTasks} addPagination={true} />
      </div>
    </CollapseCard>
  )
}
