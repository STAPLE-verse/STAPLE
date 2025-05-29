import ChatBox from "src/comments/components/ChatBox"
import { filterFirstTaskLog } from "../utils/filterFirstTaskLog"
import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"
import CompleteSchema from "./CompleteSchema"
import { Status } from "db"
import CompleteToggle from "./CompleteToggle"
import TaskLogHistoryModal from "./TaskLogHistoryModal"
import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"
import { useState } from "react"
import { CompletedAs as CompletedAsType } from "db"
import { ExtendedTaskLog } from "src/core/types"

export const CompleteRow = ({
  taskLogs,
  completedById,
  completedAs,
  schema,
  ui,
  isSchema,
}: {
  taskLogs: ExtendedTaskLog[]
  completedById: any
  completedAs: any
  schema: any
  ui: any
  isSchema: boolean
}) => {
  const latestTaskLog = filterLatestTaskLog(taskLogs)

  // New taskLogs are created for each completion, so we can use the first task log to get the comments
  const firstTaskLog = filterFirstTaskLog(taskLogs)
  const [comments] = useQuery(getComments, { where: { taskLogId: firstTaskLog!.id } })

  const [isOpen, setIsOpen] = useState(true) // Collapse state

  const buttonLabel =
    latestTaskLog?.completedAs === CompletedAsType.TEAM
      ? `${latestTaskLog.status === Status.COMPLETED ? "Update" : "Provide"} ${
          latestTaskLog.assignedTo.name
        } Data`
      : `${latestTaskLog?.status === Status.COMPLETED ? "Update" : "Provide"} Individual Data`

  return (
    <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-lg">
      <input type="checkbox" onChange={() => setIsOpen(!isOpen)} checked={isOpen} />
      <div className="collapse-title text-lg font-medium cursor-pointer">{buttonLabel}</div>
      <div className="collapse-content space-y-4">
        {/* Completion Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {isSchema ? (
            <CompleteSchema
              taskLog={latestTaskLog}
              completedById={completedById}
              completedAs={completedAs}
              schema={schema}
              ui={ui}
            />
          ) : (
            <CompleteToggle
              taskLog={latestTaskLog}
              completedById={completedById}
              completedAs={completedAs}
              refetchTaskData={() => {}}
            />
          )}
          {/* Task Log History Modal */}
          <TaskLogHistoryModal taskLogs={taskLogs} schema={schema} ui={ui} />
        </div>
        {/* Chat Section */}
        <div className="mt-2">
          <ChatBox initialComments={comments} taskLogId={firstTaskLog!.id} />
        </div>
      </div>
    </div>
  )
}
