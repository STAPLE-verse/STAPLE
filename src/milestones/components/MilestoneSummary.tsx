import { useQuery } from "@blitzjs/rpc"
import "react-circular-progressbar/dist/styles.css"
import { Milestone } from "@prisma/client"
import { completedTaskPercentage } from "src/widgets/utils/completedTaskPercentage"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { completedRolePercentage } from "src/widgets/utils/completedRolePercentage"
import { CircularPercentageWidget } from "src/widgets/components/CircularPercentageWidget"
import getTasks from "src/tasks/queries/getTasks"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { TaskLogWithTask } from "src/core/types"
import CollapseCard from "src/core/components/CollapseCard"

interface MilestoneSummaryProps {
  milestone: Milestone
  projectId: number | undefined
}

export const MilestoneSummary: React.FC<MilestoneSummaryProps> = ({ milestone, projectId }) => {
  // Get tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      roles: true,
    },
    where: {
      projectId: projectId,
      milestoneId: milestone.id,
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
  const rolePercent = completedRolePercentage(tasks)

  return (
    <CollapseCard title="Milestone Statistics" className="mt-4">
      <div className="stats flex justify-between items-center gap-4 bg-base-300 text-lg font-bold">
        {/* Task status */}
        <CircularPercentageWidget
          data={taskPercent}
          title={"Task Status"}
          tooltip={"Percent of overall tasks completed by project manager"}
          noData={tasks.length === 0}
          noDataText="No tasks were assigned"
        />
        {/* Form data */}

        <CircularPercentageWidget
          data={formPercent}
          title={"Form Data"}
          tooltip={"Percent of required forms completed by contributors"}
          noData={tasks.length === 0 && formPercent <= 0}
          noDataText="No tasks with forms were assigned"
        />
        {/* Roles */}
        <CircularPercentageWidget
          data={rolePercent}
          title={"Roles"}
          tooltip={"Percent of tasks in this milestone with assigned roles"}
          //erin you need to fix this
          noData={tasks.length === 0}
          noDataText="No tasks with roles were found"
        />
      </div>
    </CollapseCard>
  )
}
