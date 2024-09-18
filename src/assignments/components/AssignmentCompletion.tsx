import { Tooltip } from "react-tooltip"
import AssignmentHistoryModal from "./AssignmentHistoryModal"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { useFilterContributorAssignment } from "../hooks/useFilterContributorAssignment"

export const AssignmentCompletion = () => {
  const { task, individualAssignments, teamAssignments } = useTaskContext()

  const { contributor: currentContributor } = useCurrentContributor(task.projectId)

  const { filteredIndividualAssignments, filteredTeamAssignments } = useFilterContributorAssignment(
    individualAssignments,
    teamAssignments,
    currentContributor!.id
  )

  return (
    <div className="card bg-base-300 mx-2 w-1/2">
      <div className="card-body">
        <div className="card-title" data-tooltip-id="tool-complete">
          Complete Task
        </div>

        <Tooltip
          id="tool-complete"
          content="Complete your individual or team task and view completion history"
          className="z-[1099] ourtooltips"
        />

        {/* if no schema complete task as a Individual*/}
        {!task.formVersion &&
          filteredIndividualAssignments &&
          filteredIndividualAssignments.length > 0 && (
            <div className="flex grid-col-2">
              <CompleteToggle
                currentAssignment={filteredIndividualAssignments[0]}
                completedLabel="Completed"
                completedBy={currentContributor?.id}
                completedAs={CompletedAs.INDIVIDUAL}
              />
              <span className="mx-2">
                <AssignmentHistoryModal
                  assignmentStatusLog={filteredIndividualAssignments[0]!.statusLogs!}
                />
              </span>
            </div>
          )}

        {/* if no schema complete task as a Team*/}
        {!task.formVersion && filteredTeamAssignments && filteredTeamAssignments.length > 0 && (
          <div>
            {filteredTeamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="flex flex-col gap-2">
                <CompleteToggle
                  currentAssignment={teamAssignment}
                  completedLabel="Completed"
                  completedBy={currentContributor?.id}
                  completedAs={CompletedAs.TEAM}
                />
                <span className="mx-2">
                  <AssignmentHistoryModal assignmentStatusLog={teamAssignment.statusLogs!} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* if schema and individual*/}
        {task.formVersion &&
          filteredIndividualAssignments &&
          filteredIndividualAssignments.length > 0 && (
            <div className="flex grid-col-2">
              <CompleteSchema
                currentAssignment={filteredIndividualAssignments[0]}
                completedBy={currentContributor?.id}
                completedAs={CompletedAs.INDIVIDUAL}
                schema={task.formVersion.schema}
                ui={task.formVersion.uiSchema}
              />
              <span className="mx-2">
                <AssignmentHistoryModal
                  assignmentStatusLog={filteredIndividualAssignments[0]!.statusLogs!}
                  schema={task.formVersion.schema}
                  ui={task.formVersion.uiSchema}
                />
              </span>
            </div>
          )}

        {/* if schema and team*/}
        {task.formVersion && filteredTeamAssignments && filteredTeamAssignments.length > 0 && (
          <div className="">
            {filteredTeamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="mb-2 flex grid-col-2">
                <CompleteSchema
                  currentAssignment={teamAssignment}
                  completedBy={currentContributor?.id}
                  completedAs={CompletedAs.TEAM}
                  schema={task.formVersion?.schema}
                  ui={task.formVersion?.uiSchema}
                />

                <span className="mx-2">
                  <AssignmentHistoryModal
                    assignmentStatusLog={teamAssignment.statusLogs!}
                    schema={task.formVersion?.schema}
                    ui={task.formVersion?.uiSchema}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
