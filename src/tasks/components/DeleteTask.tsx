import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import deleteTask from "src/tasks/mutations/deleteTask"
import { Routes } from "@blitzjs/next"

interface DeleteTaskProps {
  taskId: number
  projectId: number
}

const DeleteTask = ({ taskId, projectId }: DeleteTaskProps) => {
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)

  const handleDelete = async () => {
    if (window.confirm("The task will be permanently deleted. Are you sure to continue?")) {
      await deleteTaskMutation({ id: taskId })
      await router.push(Routes.TasksPage({ projectId }))
    }
  }

  return (
    <button type="button" className="btn btn-warning" onClick={handleDelete}>
      Delete task
    </button>
  )
}

export default DeleteTask
