import { Tooltip } from "react-tooltip"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useTaskContext } from "./TaskContext"
import useTaskLogProgress from "src/tasklogs/hooks/useTaskLogProgress"

const ShowTasklogProgress = () => {
  const { task, projectMembers } = useTaskContext()

  const taskLogProgress = useTaskLogProgress(projectMembers)

  const taskLogPercent = taskLogProgress.completed / taskLogProgress.all

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="progress-tool">
        Task Progress
      </div>
      <Tooltip
        id="progress-tool"
        content="Percent of contributors/teams that have finished the task"
        className="z-[1099] ourtooltips"
      />
      <div>
        <div className="w-20 h-20 m-2">
          <CircularProgressbar
            value={taskLogPercent * 100}
            text={`${Math.round(taskLogPercent * 100)}%`}
            data-tooltip-id="progress-tooltip"
            data-tooltip-content={`${taskLogProgress.completed} tasks out of ${taskLogProgress.all}`}
            styles={buildStyles({
              textSize: "16px",
              pathTransitionDuration: 0,
              pathColor: "oklch(var(--p))",
              textColor: "oklch(var(--s))",
              trailColor: "oklch(var(--pc))",
              backgroundColor: "oklch(var(--b3))",
            })}
          />
          <Tooltip id="progress-tooltip" className="z-[1099] ourtooltips" />
        </div>
      </div>
      <div className="stat-desc text-lg text-inherit">
        <Link
          className="btn btn-primary"
          href={Routes.AssignmentsPage({ projectId: task.projectId, taskId: task.id })}
        >
          Edit Responses
        </Link>
      </div>
    </div>
  )
}

export default ShowTasklogProgress
