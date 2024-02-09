import { useQuery } from "@blitzjs/rpc"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import { Tooltip } from "react-tooltip"

type AssignmentProgressProps = {
  taskId: number
}

const AssignmentProgress = ({ taskId }: AssignmentProgressProps) => {
  // Get assignments
  const [assignmentProgress] = useQuery(getAssignmentProgress, { taskId: taskId })

  return (
    <div>
      <progress
        className="progress w-56 h-4"
        value={assignmentProgress.completed}
        max={assignmentProgress.all}
        data-tooltip-id="progress-tooltip"
        data-tooltip-content={`${assignmentProgress.completed} tasks out of ${assignmentProgress.all}`}
      ></progress>
      <Tooltip id="progress-tooltip" />
    </div>
  )
}

export default AssignmentProgress
