import ShowTasklogProgress from "src/tasks/components/ShowTasklogProgress"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import { TaskFormData } from "./TaskFormData"
import DeleteTask from "./DeleteTask"
import Card from "src/core/components/Card"

// Interface
interface TaskSummaryProps {
  taskId: number
  projectId: number
}

// Create task summary for the PM
export const TaskSummary = ({ taskId, projectId }: TaskSummaryProps) => {
  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <Card title="Project Manager Information" className="w-full">
        <div className="stats bg-base-300 text-lg font-bold">
          {/* Complete task widget */}
          <CompleteTaskToggle />
          {/* Task form data widget */}
          <TaskFormData />
          {/* Assignment Progress widget */}
          <ShowTasklogProgress />
          {/* Task edit buttons */}
          <div className="stat place-items-center">
            <div className="stat-title text-2xl text-inherit">
              <Link
                className="btn btn-primary"
                href={Routes.EditTaskPage({ projectId: projectId, taskId: taskId })}
              >
                Update task
              </Link>
            </div>
            <div className="stat-value">
              <DeleteTask taskId={taskId} projectId={projectId} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
