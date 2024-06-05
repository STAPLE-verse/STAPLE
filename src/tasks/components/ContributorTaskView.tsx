// imports
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import { useParam } from "@blitzjs/next"
import { TaskInformation } from "./TaskInformation"
import { AssignmentCompletion } from "src/assignments/components/AssignmentCompletion"

// create task view
export const ContributorTaskView = () => {
  const taskId = useParam("taskId", "number")
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })

  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <TaskInformation task={task} />
      {/* task completion*/}
      <AssignmentCompletion task={task} />
    </div>
  )
}
