import ShowTasklogProgress from "src/tasks/components/ShowTasklogProgress"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import CollapseCard from "src/core/components/CollapseCard"
import { TaskLogTable } from "./TaskLogTable"

// Create task summary for the PM
export const TaskSummary = ({ contributorFilter }: { contributorFilter?: number }) => {
  return (
    <div className="flex flex-row justify-center mt-2 mb-2">
      {/* overall project information */}
      <CollapseCard title="Task Completion" className="w-full" defaultOpen={true}>
        {!contributorFilter && (
          <div className="flex">
            <CompleteTaskToggle />
            <ShowTasklogProgress />
          </div>
        )}

        <div>
          <TaskLogTable contributorFilter={contributorFilter} />
        </div>
      </CollapseCard>
    </div>
  )
}
