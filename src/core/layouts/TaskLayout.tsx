import { ReactNode } from "react"
import { useParam } from "@blitzjs/next" // Import useParam from Blitz
import { TaskProvider } from "src/tasks/components/TaskContext"

interface TaskLayoutProps {
  children: ReactNode
}

const TaskLayout = ({ children }: TaskLayoutProps) => {
  // Retrieve taskId from the URL
  const taskId = useParam("taskId", "number")

  return <TaskProvider taskId={taskId!}>{children}</TaskProvider>
}

export default TaskLayout
