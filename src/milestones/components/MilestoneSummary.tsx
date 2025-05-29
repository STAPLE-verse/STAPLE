import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import deleteMilestone from "src/milestones/mutations/deleteMilestone"
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

interface MilestoneSummaryProps {
  milestone: Milestone
  projectId: number | undefined
}

export const MilestoneSummary: React.FC<MilestoneSummaryProps> = ({ milestone, projectId }) => {
  // Setup
  const router = useRouter()
  const [deleteMilestoneMutation] = useMutation(deleteMilestone)

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

  // Delete event
  const handleDelete = async () => {
    if (window.confirm("This milestone will be deleted. Is that ok?")) {
      await deleteMilestoneMutation({ id: milestone.id })
      await router.push(Routes.MilestonesPage({ projectId: projectId! }))
    }
  }

  return (
    <div className="flex flex-row justify-center mt-2">
      <div className="card bg-base-300 w-full">
        <div className="card-body">
          <div className="card-title">Project Manager Information</div>

          <div className="stats bg-base-300 text-lg font-bold">
            {/* Task status */}
            <CircularPercentageWidget
              data={taskPercent}
              title={"Task Status"}
              tooltip={"Percent of overall tasks completed by project manager"}
            />
            {/* Form data */}
            {tasks.length > 0 && formPercent >= 0 && (
              <CircularPercentageWidget
                data={formPercent}
                title={"Form Data"}
                tooltip={"Percent of required forms completed by contributors"}
              />
            )}
            {/* Roles */}
            <CircularPercentageWidget
              data={rolePercent}
              title={"Roles"}
              tooltip={"Percent of tasks in this milestone with assigned roles"}
            />

            {/* Delete milestone button */}
            <div className="stat place-items-center">
              <div className="stat-title text-2xl text-inherit">Delete Milestone</div>
              <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
