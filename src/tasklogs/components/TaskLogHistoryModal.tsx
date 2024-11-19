import Table from "src/core/components/Table"
import { Prisma } from "@prisma/client"
import { processTaskLogHistory } from "src/tasklogs/tabels/processing/processTaskLogs"
import { ExtendedTaskLog } from "../hooks/useTaskLogData"
import { TaskLogHistoryFormColumns } from "../tabels/columns/TaskLogHistoryFormColumns"
import { TaskLogHistoryCompleteColumns } from "../tabels/columns/TaskLogHistoryCompleteColumns"
import ToggleModal from "src/core/components/ToggleModal"

type AssignmentHistoryModalProps = {
  taskLogs: ExtendedTaskLog[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
}
export const AssignmentHistoryModal = ({ taskLogs, schema, ui }: AssignmentHistoryModalProps) => {
  const processedAssignmentHistory = processTaskLogHistory(taskLogs, schema, ui)

  return (
    <ToggleModal buttonLabel="Show History" modalTitle="Task History" modalSize="w-11/12 max-w-3xl">
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
