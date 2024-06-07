import { Tooltip } from "react-tooltip"
import AssignmentHistoryModal from "./AssignmentHistoryModal"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { useContext } from "react"
import { TaskContext } from "src/tasks/components/TaskContext"
import { useParam } from "@blitzjs/next"

export const AssignmentCompletion = () => {
  const projectId = useParam("projectId", "number")
  // TODO: Replace by hook
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  const taskContext = useContext(TaskContext)

  if (
    !taskContext ||
    !taskContext.individualAssignments ||
    !taskContext.teamAssignments ||
    !taskContext.task
  ) {
    return <div>Loading...</div>
  }

  const { task, individualAssignments, teamAssignments, refetchTaskData } = taskContext

  return (
    <div className="card bg-base-300 mx-2 w-1/2">
      <div className="card-body">
        <div className="card-title" data-tooltip-id="tool-complete">
          Complete Task
        </div>

        <Tooltip
          id="tool-complete"
          content="Complete your individual or team task and view completion history"
          className="z-[1099]"
        />

        {/* if no schema complete task as a Individual*/}
        {!task["schema"] && individualAssignments && individualAssignments.length > 0 && (
          <div className="flex grid-col-2">
            <CompleteToggle
              currentAssignment={individualAssignments[0]}
              refetch={refetchTaskData}
              completedLabel="Completed"
              completedBy={currentContributor.id}
              completedAs={CompletedAs.INDIVIDUAL}
            />
            <span className="mx-2">
              <AssignmentHistoryModal assignmentStatusLog={individualAssignments[0]!.statusLogs} />
            </span>
          </div>
        )}

        {/* if no schema complete task as a Team*/}
        {!task["schema"] && teamAssignments && teamAssignments.length > 0 && (
          <div>
            {teamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="flex flex-col gap-2">
                <CompleteToggle
                  currentAssignment={teamAssignment}
                  refetch={refetchTaskData}
                  completedLabel="Completed"
                  completedBy={currentContributor.id}
                  completedAs={CompletedAs.TEAM}
                />
                <span className="mx-2">
                  <AssignmentHistoryModal assignmentStatusLog={teamAssignment.statusLogs} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* if schema and individual*/}
        {task["schema"] && individualAssignments && individualAssignments.length > 0 && (
          <div className="flex grid-col-2">
            <CompleteSchema
              currentAssignment={individualAssignments[0]}
              refetch={refetchTaskData}
              completedBy={currentContributor.id}
              completedAs={CompletedAs.INDIVIDUAL}
              schema={task["schema"]}
              ui={task["ui"]}
            />
            <span className="mx-2">
              <AssignmentHistoryModal assignmentStatusLog={individualAssignments[0]!.statusLogs} />
            </span>
          </div>
        )}

        {/* if schema and team*/}
        {task["schema"] && teamAssignments && teamAssignments.length > 0 && (
          <div className="">
            {teamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="mb-2 flex grid-col-2">
                <CompleteSchema
                  currentAssignment={teamAssignment}
                  refetch={refetchTaskData}
                  completedBy={currentContributor.id}
                  completedAs={CompletedAs.TEAM}
                  schema={task["schema"]}
                  ui={task["ui"]}
                />

                <span className="mx-2">
                  <AssignmentHistoryModal assignmentStatusLog={teamAssignment.statusLogs} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
