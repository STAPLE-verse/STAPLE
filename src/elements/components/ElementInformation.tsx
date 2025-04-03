import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { Element } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"
import { useState } from "react"
import UpdateTasks from "./UpdateTasks"
import { ElementTasksColumns } from "../tables/columns/ElementTasksColumns"
import { processElementTasks } from "../tables/processing/processElementTasks"
import TooltipWrapper from "src/core/components/TooltipWrapper"

interface ElementInformationProps {
  element: Element
  projectId: number | undefined
  onTasksUpdated: () => void
}

export const ElementInformation: React.FC<ElementInformationProps> = ({
  element,
  projectId,
  onTasksUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Get tasks
  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: {
      project: { id: projectId! },
    },
    orderBy: { id: "asc" },
  })

  const elementTasks = tasks.filter((task) => task.elementId === element.id)

  const processedTasks = processElementTasks(elementTasks)

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="card bg-base-300 w-1/3 mr-2">
        <div className="card-body">
          {/* Element name */}
          <div className="card-title" data-tooltip-id="element-tool">
            {element.name}
          </div>
          <TooltipWrapper
            id="element-tool"
            content="Overall element information"
            className="z-[1099] ourtooltips"
          />
          {/* Element description */}
          {element.description}
          {/* Element last update */}
          <p className="italic">
            Last update: <DateFormat date={element.updatedAt}></DateFormat>
          </p>
          {/* Show update element page */}
          <div className="card-actions justify-end">
            <Link
              className="btn btn-primary"
              href={Routes.EditElementPage({ projectId: projectId!, elementId: element.id })}
            >
              Update Element
            </Link>

            <button className="btn btn-secondary" onClick={openModal}>
              Update Tasks
            </button>
            <UpdateTasks
              elementId={element.id}
              open={isModalOpen}
              onClose={closeModal}
              onTasksUpdated={refetch}
              tasks={tasks}
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="card bg-base-300 w-2/3 h-auto">
        <div className="card-body">
          <div className="card-title" data-tooltip-id="tasks-tool">
            Tasks
          </div>
          <TooltipWrapper
            id="tasks-tool"
            content="Tasks assigned to this element"
            className="z-[1099] ourtooltips"
          />
          <div className="overflow-x-auto">
            <Table columns={ElementTasksColumns} data={processedTasks} addPagination={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
