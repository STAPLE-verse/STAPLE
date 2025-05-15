import Table from "src/core/components/Table"
import { Prisma } from "@prisma/client"
import { processTaskLogHistory } from "src/tasklogs/tables/processing/processTaskLogs"
import { TaskLogCompletedBy } from "src/core/types"
import { TaskLogHistoryFormColumns } from "../tables/columns/TaskLogHistoryFormColumns"
import { TaskLogHistoryCompleteColumns } from "../tables/columns/TaskLogHistoryCompleteColumns"
import ToggleModal from "src/core/components/ToggleModal"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

type AssignmentHistoryModalProps = {
  taskLogs: TaskLogCompletedBy[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
  isModalOpen: boolean // New prop to track modal open state
}

export const AssignmentHistoryModal = ({
  taskLogs,
  schema,
  ui,
  isModalOpen,
}: AssignmentHistoryModalProps) => {
  const processedAssignmentHistory = processTaskLogHistory(taskLogs, schema, ui)

  return (
    <ToggleModal
      key={isModalOpen ? "open" : "closed"}
      buttonLabel="Show History"
      modalTitle={
        <div className="flex justify-center items-center">
          Task History
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="task-history-tooltip"
          />
          <Tooltip
            id="task-history-tooltip"
            content="Use this table to review the history of submissions for the task for this team."
            className="z-[1099] ourtooltips"
          />
        </div>
      }
      modalSize="w-11/12 max-w-3xl"
    >
      <div className="modal-action flex flex-col">
        <Table
          columns={schema && ui ? TaskLogHistoryFormColumns : TaskLogHistoryCompleteColumns}
          data={processedAssignmentHistory}
          classNames={{
            thead: "text-base",
            tbody: "text-base",
          }}
          addPagination={true}
        />
      </div>
    </ToggleModal>
  )
}

export default AssignmentHistoryModal
