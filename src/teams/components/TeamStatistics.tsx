import CollapseCard from "src/core/components/CollapseCard"
import { useQuery } from "@blitzjs/rpc"
import { TaskLogWithTask } from "src/core/types"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getTasks from "src/tasks/queries/getTasks"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { roleDistribution } from "src/widgets/utils/roleDistribution"
import { PieChartWidget } from "src/widgets/components/PieChartWidget" // Import PieChartWidget component
import { completedTaskLogPercentage } from "src/widgets/utils/completedTaskLogPercentage"
import { Tooltip } from "react-tooltip"
import { GetCircularProgressDisplay, GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import getTeam from "../queries/getTeam"
import { completedTaskApprovalPercentage } from "src/widgets/utils/completedTaskApprovalPercentage"
import { useEffect } from "react"
import { eventBus } from "src/core/utils/eventBus"

export const TeamStatistics = ({ teamId, projectId }) => {
  // get team number
  const [team] = useQuery(getTeam, { id: teamId })

  // Calculate the number of team members
  const numberOfMembers = team?.users?.length || 0

  // get tasks for this teamId and projectId
  const [{ tasks }, { refetch: refetchTasks }] = useQuery(getTasks, {
    include: {
      roles: true,
    },
    where: {
      projectId: projectId,
      assignedMembers: {
        some: {
          id: teamId, // Filter tasks by teamId in assignedMembers
        },
      },
    },
  })

  // get taskLogs for those tasks
  const [{ taskLogs: fetchedTaskLogs }, { refetch: refetchTaskLogs }] = useQuery(getTaskLogs, {
    where: {
      taskId: { in: tasks.map((task) => task.id) },
      assignedToId: teamId,
    },
    include: {
      task: true,
    },
  })

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTask[] = (fetchedTaskLogs ?? []) as TaskLogWithTask[]

  // only the latest task log
  const allTaskLogs = getLatestTaskLogs<TaskLogWithTask>(taskLogs)

  useEffect(() => {
    const handleUpdate = () => {
      void refetchTasks()
      void refetchTaskLogs()
    }
    eventBus.on("taskLogUpdated", handleUpdate)
    return () => eventBus.off("taskLogUpdated", handleUpdate)
  }, [refetchTasks, refetchTaskLogs])

  // Calculate summary data
  const formPercent = completedFormPercentage(allTaskLogs)
  const taskPercent = completedTaskLogPercentage(allTaskLogs)
  const rolePieData = roleDistribution(tasks)
  const approvalPercent = completedTaskApprovalPercentage(allTaskLogs)

  return (
    <CollapseCard title={"Team Statistics"} className="w-full mt-4" defaultOpen={true}>
      <div className="stats bg-base-300 text-lg font-bold w-full">
        {/* Task Status */}
        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="team-number-tooltip">
            Team Members
          </div>
          <Tooltip
            id="team-number-tooltip"
            content="Number of team members"
            className="z-[1099] ourtooltips"
          />
          <GetIconDisplay number={numberOfMembers} icon={UserGroupIcon} />
        </div>

        {/* Task Status */}
        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-status-tooltip">
            Task Status
          </div>
          <Tooltip
            id="task-status-tooltip"
            content="Percent of overall tasks completed by the team"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={taskPercent} />
              </div>
            </>
          )}
        </div>

        {/* Task approval */}
        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-approval-tooltip">
            Task Approval
          </div>
          <Tooltip
            id="task-approval-tooltip"
            content="Percent of overall tasks completed by the team"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={approvalPercent} />
              </div>
            </>
          )}
        </div>

        {/* Form Status */}
        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="form-status-tooltip">
            <>Form Data</>
          </div>
          <Tooltip
            id="form-status-tooltip"
            content="Percent of required forms completed by the team"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 || formPercent <= 0 ? (
            <>No forms were required</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={formPercent} />
              </div>
            </>
          )}
        </div>

        {/* Role Pie Chart */}
        <PieChartWidget
          data={rolePieData}
          titleWidget={"Role Distribution"}
          tooltip={"The distribution of roles across tasks assigned to the team"}
          noData={tasks.length === 0 || rolePieData.length === 0}
          noDataText="No tasks with roles found"
        />
      </div>
    </CollapseCard>
  )
}
