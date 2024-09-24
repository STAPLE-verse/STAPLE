import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import deleteElement from "src/elements/mutations/deleteElement"
import "react-circular-progressbar/dist/styles.css"
import { Element } from "@prisma/client"
import { completedTaskPercentage } from "src/widgets/utils/completedTaskPercentage"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { completedRolePercentage } from "src/widgets/utils/completedRolePercentage"
import { CircularPercentageWidget } from "src/widgets/components/CircularPercentageWidget"
import getTasks from "src/tasks/queries/getTasks"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"

interface ElementSummaryProps {
  element: Element
  projectId: number | undefined
}

export const ElementSummary: React.FC<ElementSummaryProps> = ({ element, projectId }) => {
  // Setup
  const router = useRouter()
  const [deleteElementMutation] = useMutation(deleteElement)

  // Get tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      roles: true,
    },
    where: {
      projectId: projectId,
      elementId: element.id,
    },
  })

  // get taskLogs for those tasks
  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      taskId: { in: tasks.map((task) => task.id) },
    },
    include: {
      task: true,
    },
  })
  // only the latest task log
  const allTaskLogs = getLatestTaskLogs(taskLogs)

  // Calculate summary data
  const taskPercent = completedTaskPercentage(tasks)
  const formPercent = completedFormPercentage(allTaskLogs)
  const rolePercent = completedRolePercentage(tasks)

  // Delete event
  const handleDelete = async () => {
    if (window.confirm("This element will be deleted. Is that ok?")) {
      await deleteElementMutation({ id: element.id })
      await router.push(Routes.ElementsPage({ projectId: projectId! }))
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
            <CircularPercentageWidget
              data={formPercent}
              title={"Form Data"}
              tooltip={"Percent of required forms completed by contributors"}
            />
            {/* Roles */}
            <CircularPercentageWidget
              data={rolePercent}
              title={"Roles"}
              tooltip={"Percent of tasks in this element with assigned roles"}
            />

            {/* Delete element button */}
            <div className="stat place-items-center">
              <div className="stat-title text-2xl text-inherit">Delete Element</div>
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
