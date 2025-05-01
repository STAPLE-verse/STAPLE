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
import { completedTaskPercentage } from "src/widgets/utils/completedTaskPercentage"
import { CircularPercentageWidget } from "src/widgets/components/CircularPercentageWidget"
import { roleDistribution } from "src/widgets/utils/roleDistribution"

export const TeamStatistics = ({ teamId, projectId }) => {
  // get tasks for this teamId and projectId
  // Get tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      roles: true,
    },
    where: {
      projectId: projectId,
      id: teamId,
    },
  })

  // get taskLogs for those tasks
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      taskId: { in: tasks.map((task) => task.id) },
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
  const taskPercent = completedTaskPercentage(tasks)
  const roleDistribution = roleDistribution(tasks)

  return (
    <CollapseCard title={"Team Statistics"} className="w-full mt-4">
      {/* Task status */}
      <CircularPercentageWidget
        data={taskPercent}
        title={"Task Status"}
        tooltip={"Percent of overall tasks completed by the team"}
      />
      {/* Form data */}
      <CircularPercentageWidget
        data={formPercent}
        title={"Form Data"}
        tooltip={"Percent of required forms completed the team"}
      />
    </CollapseCard>
  )
}
