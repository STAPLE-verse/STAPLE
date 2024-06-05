//imports
import { useQuery, useMutation } from "@blitzjs/rpc"
import deleteTask from "src/tasks/mutations/deleteTask"
import ShowAssignmentProgress from "src/tasks/components/ShowAssignmentProgress"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"
import { CompleteTaskToggle } from "./CompleteTaskToggle"
import { TaskFormData } from "./TaskFormData"

// create task view
export const TaskSummary = ({ task }) => {
  // Setup
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)

  // Get assignments
  const [assignmentProgress, { refetch: refetchAssignmentProgress }] = useQuery(
    getAssignmentProgress,
    { taskId: task.id }
  )

  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <div className="card bg-base-300 mx-2 w-full">
        <div className="card-body">
          <div className="card-title">PM Information</div>
          {/* Complete task widget */}
          <CompleteTaskToggle task={task} assignmentProgress={assignmentProgress} />
          {/* Task form data widget */}
          <TaskFormData task={task} />
          {/* Assignment Progress widget */}

          <ShowAssignmentProgress task={task} assignmentProgress={assignmentProgress} />

          {/* Task edit buttons */}
          <div className="stat place-items-center">
            <div className="stat-title text-2xl text-inherit">
              <Link
                className="btn btn-primary"
                href={Routes.EditTaskPage({ projectId: task.projectId, taskId: task.id })}
              >
                Update task
              </Link>
            </div>
            <div className="stat-value">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={async () => {
                  if (
                    window.confirm(
                      "The task will be permanently deleted. Are you sure to continue?"
                    )
                  ) {
                    await deleteTaskMutation({ id: task.id })
                    await router.push(Routes.TasksPage({ projectId: task.projectId }))
                  }
                }}
              >
                Delete task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
