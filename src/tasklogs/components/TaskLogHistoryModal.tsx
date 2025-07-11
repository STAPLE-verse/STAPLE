import { useEffect, useState } from "react"
import Table from "src/core/components/Table"
import { MemberPrivileges, Prisma } from "@prisma/client"
import { processTaskLogHistoryModal } from "src/tasklogs/tables/processing/processTaskLogs"
import { TaskLogCompletedBy } from "src/core/types"
import { TaskLogHistoryFormColumns } from "../tables/columns/TaskLogHistoryFormColumns"
import { TaskLogHistoryCompleteColumns } from "../tables/columns/TaskLogHistoryCompleteColumns"
import ToggleModal from "src/core/components/ToggleModal"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { eventBus } from "src/core/utils/eventBus"

type TaskLogHistoryModalProps = {
  taskLogs: TaskLogCompletedBy[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
  refetchTaskData?: () => Promise<void>
  privilege: MemberPrivileges
}

export const TaskLogHistoryModal = ({
  taskLogs,
  schema,
  ui,
  refetchTaskData,
  privilege,
}: TaskLogHistoryModalProps) => {
  const [internalTaskLogHistory, setInternalTaskLogHistory] = useState(
    processTaskLogHistoryModal(taskLogs, privilege, schema, ui)
  )

  let contextRefetch: (() => Promise<void>) | undefined = undefined
  try {
    const context = useTaskContext()
    if (context.refetchTaskData) {
      contextRefetch = async () => {
        await context.refetchTaskData()
      }
    }
  } catch (e) {
    // context not available
  }

  useEffect(() => {
    setInternalTaskLogHistory(processTaskLogHistoryModal(taskLogs, privilege, schema, ui))
  }, [taskLogs, privilege, schema, ui])

  const handleClose = () => {
    eventBus.emit("taskLogUpdated")
  }

  return (
    <ToggleModal
      buttonLabel="Show History"
      buttonClassName="w-full"
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
        } else if (contextRefetch) {
          await contextRefetch()
        }
        setInternalTaskLogHistory(processTaskLogHistoryModal(taskLogs, privilege, schema, ui))
      }}
      onClose={handleClose}
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
