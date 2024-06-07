import { useQuery } from "@blitzjs/rpc"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import { Tooltip } from "react-tooltip"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useContext } from "react"
import { TaskContext } from "./TaskContext"

const ShowAssignmentProgress = () => {
  const taskContext = useContext(TaskContext)

  if (!taskContext || !taskContext.assignmentProgress || !taskContext.task) {
    return <div>Loading...</div>
  }

  const { task, assignmentProgress } = taskContext

  const assignmentPercent = assignmentProgress.completed / assignmentProgress.all

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="progress-tool">
        Task Progress
      </div>
      <Tooltip
        id="progress-tool"
        content="Percent of contributors/teams that have finished the task"
        className="z-[1099]"
      />
      <div>
        <div className="w-20 h-20 m-2">
          <CircularProgressbar
            value={assignmentPercent * 100}
            text={`${Math.round(assignmentPercent * 100)}%`}
            data-tooltip-id="progress-tooltip"
            data-tooltip-content={`${assignmentProgress.completed} tasks out of ${assignmentProgress.all}`}
            styles={buildStyles({
              textSize: "16px",
              pathTransitionDuration: 0,
              pathColor: "oklch(var(--p))",
              textColor: "oklch(var(--s))",
              trailColor: "oklch(var(--pc))",
              backgroundColor: "oklch(var(--b3))",
            })}
          />
          <Tooltip id="progress-tooltip" />
        </div>
      </div>
      <div className="stat-desc text-lg text-inherit">
        <Link
          className="btn btn-primary"
          href={Routes.AssignmentsPage({ projectId: task.projectId, taskId: task.id })}
        >
          Review
        </Link>
      </div>
    </div>
  )
}

export default ShowAssignmentProgress
