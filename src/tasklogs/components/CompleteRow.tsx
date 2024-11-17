import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import TaskLogHistoryModal from "./TaskLogHistoryModal"

export const CompleteRow = ({ taskLogs, completedById, completedAs, schema, ui, isSchema }) => {
  const latestTaskLog = filterLatestTaskLog(taskLogs)

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
          completedRole="Completed"
          completedById={completedById}
          completedAs={completedAs}
        />
      )}
      <span className="mx-2">
        <TaskLogHistoryModal taskLogs={taskLogs} schema={schema} ui={ui} />
      </span>
    </div>
  )
}
