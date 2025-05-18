import { useEffect, useState } from "react"
import Table from "src/core/components/Table"
import { Prisma } from "@prisma/client"
import { processTaskLogHistoryModal } from "src/tasklogs/tables/processing/processTaskLogs"
import { TaskLogCompletedBy } from "src/core/types"
import { TaskLogHistoryFormColumns } from "../tables/columns/TaskLogHistoryFormColumns"
import { TaskLogHistoryCompleteColumns } from "../tables/columns/TaskLogHistoryCompleteColumns"
import ToggleModal from "src/core/components/ToggleModal"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { useTaskContext } from "src/tasks/components/TaskContext"

type TaskLogHistoryModalProps = {
  taskLogs: TaskLogCompletedBy[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
}

export const TaskLogHistoryModal = ({ taskLogs, schema, ui }: TaskLogHistoryModalProps) => {
  const [internalTaskLogHistory, setInternalTaskLogHistory] = useState(
    processTaskLogHistoryModal(taskLogs, schema, ui)
  )

  let refetchTaskData: (() => Promise<void>) | undefined = undefined
  try {
    const context = useTaskContext()
    if (context.refetchTaskData) {
      refetchTaskData = async () => {
        await context.refetchTaskData()
      }
    }
  } catch (e) {
    // context not available
  }

  useEffect(() => {
    setInternalTaskLogHistory(processTaskLogHistoryModal(taskLogs, schema, ui))
  }, [taskLogs, schema, ui])

  return (
    <ToggleModal
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
      onOpen={async () => {
        if (refetchTaskData) {
          await refetchTaskData()
        }
        setInternalTaskLogHistory(processTaskLogHistoryModal(taskLogs, schema, ui))
      }}
    >
      <div className="modal-action flex flex-col">
        <Table
          columns={schema && ui ? TaskLogHistoryFormColumns : TaskLogHistoryCompleteColumns}
          data={internalTaskLogHistory}
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

export default TaskLogHistoryModal
