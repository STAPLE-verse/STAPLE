import { RoleTeamTableColumns } from "../tables/columns/RoleTeamTableColumns"
import { processRoleTeam } from "../tables/processing/processRoleTeam"
import ProjectMemberRolesList from "src/projectmembers/components/ProjectMemberRolesList"
import CollapseCard from "src/core/components/CollapseCard"
import { useQuery } from "@blitzjs/rpc"
import { TaskLogWithTask } from "src/core/types"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getTasks from "src/tasks/queries/getTasks"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { CircularPercentageWidget } from "src/widgets/components/CircularPercentageWidget"
import { roleDistribution } from "src/widgets/utils/roleDistribution"
import { PieChartWidget } from "src/widgets/components/PieChartWidget" // Import PieChartWidget component
import { completedTaskLogPercentage } from "src/widgets/utils/completedTaskLogPercentage"

export const TeamStatistics = ({ teamId, projectId }) => {
  // get tasks for this teamId and projectId
  const [{ tasks }] = useQuery(getTasks, {
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
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      taskId: { in: tasks.map((task) => task.id) },
      assignedToId: teamId,
    },
    include: {
      task: true,
    },
  }) as unknown as TaskLogWithTask[]

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTask[] = (fetchedTaskLogs ?? []) as TaskLogWithTask[]

  // only the latest task log
  const allTaskLogs = getLatestTaskLogs<TaskLogWithTask>(taskLogs)

  // Calculate summary data
  const formPercent = completedFormPercentage(allTaskLogs)
  const taskPercent = completedTaskLogPercentage(allTaskLogs)
  const rolePieData = roleDistribution(tasks)

  console.log(rolePieData)

  return (
    <CollapseCard title={"Team Statistics"} className="w-full mt-4">
      <div className="stats bg-base-300 text-lg font-bold w-full">
        <CircularPercentageWidget
          data={taskPercent}
          title={"Task Status"}
          tooltip={"Percent of overall tasks completed by the team"}
          noData={tasks.length === 0}
          noDataText="No tasks were found"
        />
        <CircularPercentageWidget
          data={formPercent}
          title={"Form Data"}
          tooltip={"Percent of required forms completed by the team"}
          noData={tasks.length === 0 || formPercent <= 0}
          noDataText="No forms were required"
        />
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
