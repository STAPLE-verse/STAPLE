import { Tooltip } from "react-tooltip"
import AssignmentHistoryModal from "./AssignmentHistoryModal"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import useAssignmentData from "../hooks/useAssignmentData"
import { CompletedAs } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"

export const AssignmentCompletion = ({ task }) => {
  // TODO: Replace by hook
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: task.projectId, userId: currentUser!.id },
  })

  // Get assignment data
  const { individualAssignments, teamAssignments, refetchCurrentAssignments } = useAssignmentData(
    task.id,
    task.projectId
  )

  // const refetchAssignments = async () => {
  //   await refetchCurrentAssignments()
  //   //await refetchAssignmentProgress()
  // }

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
              refetch={refetchCurrentAssignments}
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
                  refetch={refetchCurrentAssignments}
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
              refetch={refetchCurrentAssignments}
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
                  refetch={refetchCurrentAssignments}
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
