import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { Element } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"
import { elementTasksTableColumns } from "src/tasks/components/TaskTable"
import { processElementTasks } from "src/tasks/utils/processTasks"

interface ElementInformationProps {
  element: Element
  projectId: number | undefined
}

export const ElementInformation: React.FC<ElementInformationProps> = ({ element, projectId }) => {
  // Get tasks
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId! },
      elementId: element.id,
    },
    orderBy: { id: "asc" },
  })

  const processedTasks = processElementTasks(tasks)

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="card bg-base-300 w-1/2 mr-2">
        <div className="card-body">
          {/* Element name */}
          <div className="card-title" data-tooltip-id="element-tool">
            {element.name}
          </div>
          <Tooltip id="element-tool" content="Overall element information" className="z-[1099]" />
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
              Update element
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="card bg-base-300 w-1/2 h-auto">
        <div className="card-body">
          <div className="card-title" data-tooltip-id="tasks-tool">
            Tasks
          </div>
          <Tooltip id="tasks-tool" content="Tasks assigned to this element" className="z-[1099]" />
          <div className="overflow-x-auto">
            <Table
              columns={elementTasksTableColumns}
              data={processedTasks}
              addPagination={true}
              classNames={{
                table: "table-auto w-full text-sm",
                thead: "text-sm text-base-content",
                tbody: "text-md",
                tfoot: "text-sm",
                th: "p-2",
                td: "p-2",
                paginationButton: "btn-xs",
                pageInfo: "text-xs",
                goToPageInput: "input-xs",
                pageSizeSelect: "select-xs",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
