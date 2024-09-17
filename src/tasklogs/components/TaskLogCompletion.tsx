import { Tooltip } from "react-tooltip"
import AssignmentHistoryModal from "./TaskLogHistoryModal"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"

export const AssignmentCompletion = () => {
  const { task, individualAssignments, teamAssignments } = useTaskContext()

  const { projectMember: currentProjectMember } = useCurrentProjectMember(task.projectId)

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
        {!task.formVersion && individualAssignments && individualAssignments.length > 0 && (
          <div className="flex grid-col-2">
            <CompleteToggle
              currentAssignment={individualAssignments[0]}
              completedRole="Completed"
              completedBy={currentProjectMember?.id}
              completedAs={CompletedAs.INDIVIDUAL}
            />
            <span className="mx-2">
              <AssignmentHistoryModal assignmentStatusLog={individualAssignments[0]!.statusLogs!} />
            </span>
          </div>
        )}

        {/* if no schema complete task as a Team*/}
        {!task.formVersion && teamAssignments && teamAssignments.length > 0 && (
          <div>
            {teamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="flex flex-col gap-2">
                <CompleteToggle
                  currentAssignment={teamAssignment}
                  completedRole="Completed"
                  completedBy={currentProjectMember?.id}
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
        {task.formVersion && individualAssignments && individualAssignments.length > 0 && (
          <div className="flex grid-col-2">
            <CompleteSchema
              currentAssignment={individualAssignments[0]}
              completedBy={currentProjectMember?.id}
              completedAs={CompletedAs.INDIVIDUAL}
              schema={task.formVersion.schema}
              ui={task.formVersion.uiSchema}
            />
            <span className="mx-2">
              <AssignmentHistoryModal
                assignmentStatusLog={individualAssignments[0]!.statusLogs!}
                schema={task.formVersion.schema}
                ui={task.formVersion.uiSchema}
              />
            </span>
          </div>
        )}

        {/* if schema and team*/}
        {task.formVersion && teamAssignments && teamAssignments.length > 0 && (
          <div className="">
            {teamAssignments.map((teamAssignment) => (
              <div key={teamAssignment.id} className="mb-2 flex grid-col-2">
                <CompleteSchema
                  currentAssignment={teamAssignment}
                  completedBy={currentProjectMember?.id}
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
