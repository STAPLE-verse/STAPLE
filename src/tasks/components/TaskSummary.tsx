import ShowTasklogProgress from "src/tasks/components/ShowTasklogProgress"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import { TaskFormData } from "./TaskFormData"
import CollapseCard from "src/core/components/CollapseCard"

// Interface
interface TaskSummaryProps {
  taskId: number
  projectId: number
}

// Create task summary for the PM
export const TaskSummary = ({ taskId, projectId }: TaskSummaryProps) => {
  return (
    <div className="flex flex-row justify-center mt-2 mb-2">
      {/* overall project information */}
      <CollapseCard title="Project Manager Information" className="w-full" defaultOpen={true}>
        <div className="stats bg-base-300 text-lg font-bold">
          {/* Complete task widget */}
          <CompleteTaskToggle />
          {/* Task form data widget */}
          <TaskFormData />
          {/* Assignment Progress widget */}
          <ShowTasklogProgress />
          {taskId} {projectId}
        </div>
      </CollapseCard>
    </div>
  )
}
