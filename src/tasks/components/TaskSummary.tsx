//imports
import { useMutation } from "@blitzjs/rpc"
import deleteTask from "src/tasks/mutations/deleteTask"
import ShowAssignmentProgress from "src/tasks/components/ShowAssignmentProgress"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import { TaskFormData } from "./TaskFormData"

// Interface
interface TaskSummaryProps {
  taskId: number
  projectId: number
}

// Create task summary for the PM
export const TaskSummary = ({ taskId, projectId }: TaskSummaryProps) => {
  // Setup
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)
  // Handle events
  const handleDelete = async () => {
    if (window.confirm("The task will be permanently deleted. Are you sure to continue?")) {
      await deleteTaskMutation({ id: taskId })
      await router.push(Routes.TasksPage({ projectId: projectId }))
    }
  }

  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <div className="card bg-base-300 mx-2 w-full">
        <div className="card-body">
          <div className="card-title">PM Information</div>

          <div className="stats bg-base-300 text-lg font-bold">
            {/* Complete task widget */}
            <CompleteTaskToggle />
            {/* Task form data widget */}
            <TaskFormData />
            {/* Assignment Progress widget */}
            <ShowAssignmentProgress />
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
                <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                  Delete task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
