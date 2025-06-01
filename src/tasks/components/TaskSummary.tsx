import ShowTasklogProgress from "src/tasks/components/ShowTasklogProgress"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import CollapseCard from "src/core/components/CollapseCard"
import { TaskLogTable } from "./TaskLogTable"

// Create task summary for the PM
export const TaskSummary = () => {
  return (
    <div className="flex flex-row justify-center mt-2 mb-2">
      {/* overall project information */}
      <CollapseCard title="Project Manager Information" className="w-full" defaultOpen={true}>
        <div className="flex">
          <CompleteTaskToggle />
          <ShowTasklogProgress />
        </div>

        <div>
          <TaskLogTable />
        </div>
      </CollapseCard>
    </div>
  )
}
