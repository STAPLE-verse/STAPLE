import "react-circular-progressbar/dist/styles.css"
import { useTaskContext } from "./TaskContext"
import useTaskLogProgress from "src/tasklogs/hooks/useTaskLogProgress"
import Stat from "src/core/components/Stat"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import { Tooltip } from "react-tooltip"

const ShowTasklogProgress = () => {
  const { task, projectMembers } = useTaskContext()

  const taskLogProgress = useTaskLogProgress(projectMembers)

  const taskLogPercent = taskLogProgress.completed / taskLogProgress.all
  const approvedLogPercent = taskLogProgress.approved / taskLogProgress.all

  return (
    <>
      {" "}
      <Stat
        title="Task Progress"
        tooltipContent="Percent of contributors/teams that have finished the task"
      >
        <div className="w-20 h-20 mt-2" data-tooltip-id="progress-tooltip">
          <GetCircularProgressDisplay proportion={taskLogPercent} />
          <Tooltip
            id="progress-tooltip"
            content={`${taskLogProgress.completed} tasks out of ${taskLogProgress.all}`}
            className="z-[1099] ourtooltips"
          />
        </div>
      </Stat>
      <Stat title="Task Approval" tooltipContent="Percent tasks that have been approved">
        <div className="w-20 h-20 mt-2" data-tooltip-id="approved-tooltip">
          <GetCircularProgressDisplay proportion={approvedLogPercent} />
          <Tooltip
            id="approved-tooltip"
            content={`${taskLogProgress.approved} tasks out of ${taskLogProgress.all}`}
            className="z-[1099] ourtooltips"
          />
        </div>
      </Stat>
    </>
  )
}

export default ShowTasklogProgress
