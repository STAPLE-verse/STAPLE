import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import deleteElement from "src/elements/mutations/deleteElement"
import getTasks from "src/tasks/queries/getTasks"
import "react-circular-progressbar/dist/styles.css"
import { Element } from "@prisma/client"
import { completedTaskPercentage } from "src/widgets/utils/completedTaskPercentage"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { completedLabelPercentage } from "src/widgets/utils/completedLabelPercentage"
import { CircularPercentageWidget } from "src/widgets/components/CircularPercentageWidget"

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
      assignees: { include: { statusLogs: true } },
      labels: true,
    },
    where: {
      projectId: projectId,
      elementId: element.id,
    },
  })

  // Calculate summary data
  const taskPercent = completedTaskPercentage(tasks)
  const formPercent = completedFormPercentage(tasks)
  const labelPercent = completedLabelPercentage(tasks)

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
          <div className="card-title">PM Information</div>

          <div className="stats bg-base-300 text-lg font-bold">
            {/* Task status */}
            <CircularPercentageWidget
              data={taskPercent}
              title={"Task Status"}
              tooltip={"Percent of overall tasks completed by PM"}
            />
            {/* Form data */}
            <CircularPercentageWidget
              data={formPercent}
              title={"Form Data"}
              tooltip={"Percent of required forms completed"}
            />
            {/* Labels */}
            <CircularPercentageWidget
              data={labelPercent}
              title={"Labels"}
              tooltip={"Percent of tasks in this element with labels"}
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
