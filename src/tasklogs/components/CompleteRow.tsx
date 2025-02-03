import ChatBox from "src/comments/components/ChatBox"
import { filterFirstTaskLog } from "../utils/filterFirstTaskLog"
import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import TaskLogHistoryModal from "./TaskLogHistoryModal"
import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"

export const CompleteRow = ({ taskLogs, completedById, completedAs, schema, ui, isSchema }) => {
  const latestTaskLog = filterLatestTaskLog(taskLogs)

  // New taskLogs are created for each completion, so we can use the first task log to get the comments
  const firstTaskLog = filterFirstTaskLog(taskLogs)
  const [comments] = useQuery(getComments, { where: { taskLogId: firstTaskLog!.id } })

  return (
    <div className="flex flex-row gap-2">
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
        />
      )}
      <span className="mx-2">
        <TaskLogHistoryModal taskLogs={taskLogs} schema={schema} ui={ui} />
      </span>
      <ChatBox initialComments={comments} taskLogId={firstTaskLog!.id} />
    </div>
  )
}
