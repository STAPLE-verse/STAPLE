import { useQuery } from "@blitzjs/rpc"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import { Tooltip } from "react-tooltip"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

type AssignmentProgressProps = {
  taskId: number
}

const AssignmentProgress = ({ taskId }: AssignmentProgressProps) => {
  // Get assignments
  const [assignmentProgress] = useQuery(getAssignmentProgress, { taskId: taskId })
  const assignmentPercent = assignmentProgress.completed / assignmentProgress.all

  return (
    <div className="w-20 h-20 m-2">
      <CircularProgressbar
        value={assignmentPercent * 100}
        text={`${Math.round(assignmentPercent * 100)}%`}
        data-tooltip-id="progress-tooltip"
        data-tooltip-content={`${assignmentProgress.completed} tasks out of ${assignmentProgress.all}`}
        styles={buildStyles({
          textSize: "16px",
          pathTransitionDuration: "none",
          pathColor: "oklch(var(--p))",
          textColor: "oklch(var(--s))",
          trailColor: "oklch(var(--pc))",
          backgroundColor: "oklch(var(--b3))",
        })}
      />
      <Tooltip id="progress-tooltip" />
    </div>
  )
}

export default AssignmentProgress
